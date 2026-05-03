// Edge Function: monitor-api-billing
// Centralized API billing monitor — checks 10 APIs, stores snapshots, triggers alerts
// Deploy: supabase functions deploy monitor-api-billing --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rate-limiter.ts";

// ── CORS ──
const ALLOWED_ORIGINS = [
  'https://maestrohvacr.com',
  'https://maestroac-clon.netlify.app',
  'https://maestroac-app-clon.pages.dev',
  'https://www.maestrohvacr.com',
  'https://maestrohvacr.com',
  'https://www.maestrohvacr.com',
  'https://acvolttech.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];
let corsHeaders: Record<string, string> = {};
function initCors(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  corsHeaders = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Vary': 'Origin',
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// ── Supabase client ──
function getSupabase() {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(url, key);
}

// ── Admin verification ──
async function verifyAdmin(supabase: any, email: string): Promise<boolean> {
  const _e = email.toLowerCase().trim();
  const { data: admins } = await supabase.from('admin_students').select('id').eq('email', _e).limit(1);
  if (admins && admins.length > 0) return true;
  const { data: staff } = await supabase.from('admin_staff').select('id').eq('activo', true).ilike('email', _e).limit(1);
  return !!(staff && staff.length > 0);
}

// ══════════════════════════════════════════════════
// PER-API CHECK IMPLEMENTATIONS
// ══════════════════════════════════════════════════

interface CheckResult {
  usage_current: number;
  usage_limit: number;
  usage_pct: number;
  cost_usd: number;
  status: string;
  raw_response?: any;
  error_message?: string;
}

async function checkCloudflare(): Promise<CheckResult> {
  const token = Deno.env.get('CF_API_TOKEN');
  const accountId = Deno.env.get('CF_ACCOUNT_ID');
  if (!token || !accountId) return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 0, status: 'unknown', error_message: 'CF_API_TOKEN or CF_ACCOUNT_ID not configured' };

  const headers = { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

  // Check Stream storage usage (Cloudflare Stream bills $1/1,000 min stored — no hard cap)
  let streamMinutes = 0;
  let streamLimit = 50000; // soft budget cap — 50K min (~$50/mo in storage)
  try {
    const streamRes = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/storage-usage`, { headers });
    if (streamRes.ok) {
      const streamData = await streamRes.json();
      streamMinutes = streamData?.result?.totalStorageMinutes || 0;
    }
  } catch (_) { /* continue */ }

  // Check Workers analytics — TODAY only (UTC midnight to now)
  let workerReqs = 0;
  const workerLimit = 100000; // free plan = 100K requests/day
  try {
    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const gqlBody = JSON.stringify({
      query: `query {
        viewer {
          accounts(filter:{accountTag:"${accountId}"}) {
            workersInvocationsAdaptive(
              limit: 100,
              filter: {
                datetime_geq: "${todayStart.toISOString()}",
                datetime_leq: "${now.toISOString()}"
              }
            ) {
              sum { requests }
            }
          }
        }
      }`
    });
    const wRes = await fetch('https://api.cloudflare.com/client/v4/graphql', { method: 'POST', headers, body: gqlBody });
    if (wRes.ok) {
      const wData = await wRes.json();
      // Sum all rows returned (there may be multiple adaptive samples)
      const rows = wData?.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive || [];
      let total = 0;
      for (const row of rows) { total += row?.sum?.requests || 0; }
      workerReqs = total;
    }
  } catch (_) { /* continue */ }

  // Use the more concerning metric (higher %)
  const streamPct = streamLimit > 0 ? (streamMinutes / streamLimit) * 100 : 0;
  const workerPct = workerLimit > 0 ? (workerReqs / workerLimit) * 100 : 0;
  const usePct = Math.max(streamPct, workerPct);
  const remainPct = 100 - usePct;

  let status = 'ok';
  if (remainPct <= 2) status = 'depleted';
  else if (remainPct <= 10) status = 'critical';
  else if (remainPct <= 20) status = 'warning';

  return {
    usage_current: workerPct > streamPct ? workerReqs : streamMinutes,
    usage_limit: workerPct > streamPct ? workerLimit : streamLimit,
    usage_pct: Math.round(usePct * 100) / 100,
    cost_usd: 0,
    status,
    raw_response: { streamMinutes, streamLimit, workerReqs, workerLimit, workerPct: workerPct.toFixed(2), streamPct: streamPct.toFixed(2) },
  };
}

async function checkElevenLabs(): Promise<CheckResult> {
  const key = Deno.env.get('ELEVENLABS_API_KEY');
  if (!key) return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 330, status: 'unknown', error_message: 'ELEVENLABS_API_KEY not configured' };

  const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': key },
  });

  if (!res.ok) {
    const errText = await res.text();
    return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 330, status: 'error', error_message: `ElevenLabs API ${res.status}: ${errText}` };
  }

  const data = await res.json();
  const used = data.character_count || 0;
  const limit = data.character_limit || 1;
  const pct = (used / limit) * 100;
  const remainPct = 100 - pct;

  let status = 'ok';
  if (remainPct <= 2) status = 'depleted';
  else if (remainPct <= 10) status = 'critical';
  else if (remainPct <= 20) status = 'warning';

  return {
    usage_current: used,
    usage_limit: limit,
    usage_pct: Math.round(pct * 100) / 100,
    cost_usd: 330,
    status,
    raw_response: data,
  };
}

async function checkHeyGen(): Promise<CheckResult> {
  const key = Deno.env.get('HEYGEN_API_KEY');
  if (!key) return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 0, status: 'unknown', error_message: 'HEYGEN_API_KEY not configured' };

  const res = await fetch('https://api.heygen.com/v2/user/remaining_quota', {
    headers: { 'X-Api-Key': key },
  });

  if (!res.ok) {
    return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 0, status: 'error', error_message: `HeyGen API ${res.status}` };
  }

  const data = await res.json();
  const remaining = data?.data?.remaining_quota ?? 0;
  // HeyGen doesn't always return total — estimate from remaining
  const total = remaining > 0 ? remaining * 2 : 100; // rough estimate
  const usedPct = total > 0 ? ((total - remaining) / total) * 100 : 0;

  let status = 'ok';
  const remainPct = 100 - usedPct;
  if (remainPct <= 2) status = 'depleted';
  else if (remainPct <= 10) status = 'critical';
  else if (remainPct <= 20) status = 'warning';

  return {
    usage_current: total - remaining,
    usage_limit: total,
    usage_pct: Math.round(usedPct * 100) / 100,
    cost_usd: 0,
    status,
    raw_response: data,
  };
}

async function checkSupabase(): Promise<CheckResult> {
  const token = Deno.env.get('SUPABASE_MGMT_TOKEN');
  if (!token) return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 25, status: 'unknown', error_message: 'SUPABASE_MGMT_TOKEN not configured' };

  const projectRef = 'htklsowiyjwsjnacnvnr';
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/usage`, {
    headers: { 'Authorization': 'Bearer ' + token },
  });

  if (!res.ok) {
    return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 25, status: 'error', error_message: `Supabase API ${res.status}` };
  }

  const data = await res.json();
  // Find the highest usage percentage across all metrics
  let maxPct = 0;
  if (Array.isArray(data)) {
    for (const metric of data) {
      if (metric.usage !== undefined && metric.limit !== undefined && metric.limit > 0) {
        const pct = (metric.usage / metric.limit) * 100;
        if (pct > maxPct) maxPct = pct;
      }
    }
  }

  const remainPct = 100 - maxPct;
  let status = 'ok';
  if (remainPct <= 2) status = 'depleted';
  else if (remainPct <= 10) status = 'critical';
  else if (remainPct <= 20) status = 'warning';

  return {
    usage_current: maxPct,
    usage_limit: 100,
    usage_pct: Math.round(maxPct * 100) / 100,
    cost_usd: 25,
    status,
    raw_response: data,
  };
}

async function checkNetlify(): Promise<CheckResult> {
  const token = Deno.env.get('NETLIFY_TOKEN');
  if (!token) return { usage_current: 0, usage_limit: 3000, usage_pct: 0, cost_usd: 0, status: 'unknown', error_message: 'NETLIFY_TOKEN not configured' };

  // First get account slug
  let accountSlug = '';
  try {
    const acctRes = await fetch('https://api.netlify.com/api/v1/accounts', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (acctRes.ok) {
      const accounts = await acctRes.json();
      if (accounts.length > 0) accountSlug = accounts[0].slug;
    }
  } catch (_) { /* continue */ }

  if (!accountSlug) {
    return { usage_current: 0, usage_limit: 3000, usage_pct: 0, cost_usd: 0, status: 'unknown', error_message: 'Could not determine Netlify account' };
  }

  const res = await fetch(`https://api.netlify.com/api/v1/accounts/${accountSlug}/bandwidth`, {
    headers: { 'Authorization': 'Bearer ' + token },
  });

  if (!res.ok) {
    return { usage_current: 0, usage_limit: 3000, usage_pct: 0, cost_usd: 0, status: 'error', error_message: `Netlify API ${res.status}` };
  }

  const data = await res.json();
  const used = data.used || 0;
  const included = data.included || 1;
  const pct = (used / included) * 100;
  const remainPct = 100 - pct;

  let status = 'ok';
  if (remainPct <= 2) status = 'depleted';
  else if (remainPct <= 10) status = 'critical';
  else if (remainPct <= 20) status = 'warning';

  return {
    usage_current: used,
    usage_limit: included,
    usage_pct: Math.round(pct * 100) / 100,
    cost_usd: 0,
    status,
    raw_response: data,
  };
}

async function checkResend(): Promise<CheckResult> {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 40, status: 'unknown', error_message: 'RESEND_API_KEY not configured' };

  // Resend doesn't have a direct usage endpoint — get domain info
  const res = await fetch('https://api.resend.com/domains', {
    headers: { 'Authorization': 'Bearer ' + key },
  });

  if (!res.ok) {
    return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 40, status: 'error', error_message: `Resend API ${res.status}` };
  }

  const data = await res.json();
  // Marketing Pro = 50K emails/mo — we can't get exact count from API easily
  // Return ok with the domain count as a health check
  return {
    usage_current: 0,
    usage_limit: 50000, // Marketing Pro limit
    usage_pct: 0,
    cost_usd: 40,
    status: 'ok',
    raw_response: data,
  };
}

async function checkDeepgram(): Promise<CheckResult> {
  const key = Deno.env.get('DEEPGRAM_API_KEY');
  if (!key) return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 0, status: 'unknown', error_message: 'DEEPGRAM_API_KEY not configured' };

  // Get project usage
  const projRes = await fetch('https://api.deepgram.com/v1/projects', {
    headers: { 'Authorization': 'Token ' + key },
  });

  if (!projRes.ok) {
    return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 0, status: 'error', error_message: `Deepgram API ${projRes.status}` };
  }

  const projData = await projRes.json();
  const projectId = projData?.projects?.[0]?.project_id;
  if (!projectId) {
    return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 0, status: 'ok', raw_response: projData };
  }

  // Get usage for current billing period
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const usageRes = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/usage?start=${startOfMonth}&end=${now.toISOString()}`, {
    headers: { 'Authorization': 'Token ' + key },
  });

  if (!usageRes.ok) {
    return { usage_current: 0, usage_limit: 0, usage_pct: 0, cost_usd: 0, status: 'ok', raw_response: projData };
  }

  const usageData = await usageRes.json();
  const totalHours = usageData?.results?.[0]?.hours || 0;

  return {
    usage_current: totalHours,
    usage_limit: 0, // depends on plan
    usage_pct: 0,
    cost_usd: 0,
    status: 'ok',
    raw_response: usageData,
  };
}

// Manual-only APIs return status 'manual'
function manualResult(monthlyCost: number): CheckResult {
  return {
    usage_current: 0,
    usage_limit: 0,
    usage_pct: 0,
    cost_usd: monthlyCost,
    status: 'manual',
  };
}

// Map of API checkers
const API_CHECKERS: Record<string, () => Promise<CheckResult>> = {
  cloudflare: checkCloudflare,
  elevenlabs: checkElevenLabs,
  heygen: checkHeyGen,
  supabase: checkSupabase,
  netlify: checkNetlify,
  resend: checkResend,
  deepgram: checkDeepgram,
  anthropic: () => Promise.resolve(manualResult(50)),
  runway: () => Promise.resolve(manualResult(95)),
  google_ai: () => Promise.resolve(manualResult(0)),
};

// ══════════════════════════════════════════════════
// ALERT LOGIC
// ══════════════════════════════════════════════════

async function sendAlertEmail(supabase: any, apiName: string, status: string, message: string) {
  const RESEND_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_KEY) { console.warn('[billing] No RESEND_API_KEY for alerts'); return; }

  const emoji = status === 'depleted' ? '🔴' : status === 'critical' ? '🟠' : '🟡';
  const subject = `${emoji} API Billing Alert: ${apiName.toUpperCase()} — ${status.toUpperCase()}`;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Maestro HVACR Billing <noreply@maestrohvacr.com>',
        to: ['mvillalobos@acvolt.com'],
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
            <h2 style="color:#ef4444;">${emoji} API Billing Alert</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px;font-weight:bold;">Service:</td><td style="padding:8px;">${apiName}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Status:</td><td style="padding:8px;color:${status === 'depleted' ? '#ef4444' : status === 'critical' ? '#f97316' : '#eab308'};">${status.toUpperCase()}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Details:</td><td style="padding:8px;">${message}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Time:</td><td style="padding:8px;">${new Date().toISOString()}</td></tr>
            </table>
            <p style="color:#64748b;margin-top:20px;">— ACVOLT API Billing Monitor</p>
          </div>`,
      }),
    });
    console.log('[billing] Alert email sent for', apiName);
  } catch (e) {
    console.error('[billing] Failed to send alert email:', e);
  }
}

async function triggerAutoRecharge(supabase: any, apiName: string, config: any) {
  if (!config.auto_recharge_enabled || !config.auto_recharge_amount) return;

  const SB_URL = Deno.env.get('SUPABASE_URL');
  const SB_ANON = Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  try {
    const res = await fetch(`${SB_URL}/functions/v1/stripe-auto-recharge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_ANON },
      body: JSON.stringify({
        api_name: apiName,
        amount: config.auto_recharge_amount,
        cron_secret: Deno.env.get('CRON_SECRET') || '',
      }),
    });
    const result = await res.json();
    console.log('[billing] Auto-recharge result for', apiName, ':', result);
  } catch (e) {
    console.error('[billing] Auto-recharge call failed:', e);
  }
}

async function evaluateAndAlert(supabase: any, apiName: string, result: CheckResult, config: any) {
  if (result.status === 'ok' || result.status === 'manual' || result.status === 'unknown') return;

  // Dedup: check if same alert level was sent in last 6 hours
  const sixHoursAgo = new Date(Date.now() - 6 * 3600 * 1000).toISOString();
  const { data: recentEvents } = await supabase
    .from('api_billing_events')
    .select('id')
    .eq('api_name', apiName)
    .eq('event_type', result.status)
    .gte('created_at', sixHoursAgo)
    .limit(1);

  if (recentEvents && recentEvents.length > 0) {
    console.log(`[billing] Skipping duplicate ${result.status} alert for ${apiName}`);
    return;
  }

  const message = `${config.display_name}: ${result.usage_pct.toFixed(1)}% used (${result.usage_current}/${result.usage_limit}). Status: ${result.status}`;

  // Log event
  await supabase.from('api_billing_events').insert({
    api_name: apiName,
    event_type: result.status,
    severity: result.status === 'depleted' ? 'critical' : result.status,
    message,
    details: { usage_pct: result.usage_pct, cost_usd: result.cost_usd },
  });

  // Send email for warning+
  if (config.notify_email) {
    await sendAlertEmail(supabase, apiName, result.status, message);
  }

  // Auto-recharge on critical/depleted
  if (result.status === 'critical' || result.status === 'depleted') {
    await triggerAutoRecharge(supabase, apiName, config);
  }
}

// ══════════════════════════════════════════════════
// ACTION HANDLERS
// ══════════════════════════════════════════════════

async function actionCheckAll(supabase: any): Promise<any> {
  const { data: configs } = await supabase.from('api_billing_config').select('*').eq('is_active', true);
  if (!configs) return { error: 'No API configs found' };

  const results: Record<string, any> = {};

  for (const config of configs) {
    const checker = API_CHECKERS[config.api_name];
    if (!checker) {
      results[config.api_name] = { status: 'unknown', error_message: 'No checker implemented' };
      continue;
    }

    try {
      const result = await checker();

      // Apply config thresholds (override default 20/10/2 with per-API settings)
      if (result.status !== 'manual' && result.status !== 'unknown' && result.status !== 'error') {
        const remainPct = 100 - result.usage_pct;
        if (remainPct <= (config.depleted_pct || 2)) result.status = 'depleted';
        else if (remainPct <= (config.critical_pct || 10)) result.status = 'critical';
        else if (remainPct <= (config.warning_pct || 20)) result.status = 'warning';
        else result.status = 'ok';
      }

      // Store snapshot
      await supabase.from('api_billing_snapshots').insert({
        api_name: config.api_name,
        usage_current: result.usage_current,
        usage_limit: result.usage_limit,
        usage_pct: result.usage_pct,
        cost_usd: result.cost_usd || config.monthly_cost || 0,
        status: result.status,
        raw_response: result.raw_response || null,
        error_message: result.error_message || null,
      });

      // Evaluate alerts
      await evaluateAndAlert(supabase, config.api_name, result, config);

      results[config.api_name] = {
        status: result.status,
        usage_pct: result.usage_pct,
        cost_usd: result.cost_usd || config.monthly_cost || 0,
      };
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      console.error(`[billing] Error checking ${config.api_name}:`, errMsg);

      await supabase.from('api_billing_snapshots').insert({
        api_name: config.api_name,
        status: 'error',
        error_message: errMsg,
      });

      results[config.api_name] = { status: 'error', error_message: errMsg };
    }
  }

  return { success: true, results, checked_at: new Date().toISOString() };
}

async function actionCheckOne(supabase: any, apiName: string): Promise<any> {
  const { data: configs } = await supabase.from('api_billing_config').select('*').eq('api_name', apiName).limit(1);
  if (!configs || configs.length === 0) return { error: 'API not found: ' + apiName };

  const config = configs[0];
  const checker = API_CHECKERS[config.api_name];
  if (!checker) return { error: 'No checker for: ' + apiName };

  const result = await checker();

  // Apply config thresholds
  if (result.status !== 'manual' && result.status !== 'unknown' && result.status !== 'error') {
    const remainPct = 100 - result.usage_pct;
    if (remainPct <= (config.depleted_pct || 2)) result.status = 'depleted';
    else if (remainPct <= (config.critical_pct || 10)) result.status = 'critical';
    else if (remainPct <= (config.warning_pct || 20)) result.status = 'warning';
    else result.status = 'ok';
  }

  await supabase.from('api_billing_snapshots').insert({
    api_name: config.api_name,
    usage_current: result.usage_current,
    usage_limit: result.usage_limit,
    usage_pct: result.usage_pct,
    cost_usd: result.cost_usd || config.monthly_cost || 0,
    status: result.status,
    raw_response: result.raw_response || null,
    error_message: result.error_message || null,
  });

  await evaluateAndAlert(supabase, config.api_name, result, config);

  return { success: true, api_name: apiName, ...result };
}

async function actionGetStatus(supabase: any): Promise<any> {
  // Latest snapshot per API via distinct on
  const { data: configs } = await supabase.from('api_billing_config').select('*').eq('is_active', true).order('api_name');
  if (!configs) return { error: 'No configs' };

  const statuses = [];
  for (const cfg of configs) {
    const { data: snaps } = await supabase
      .from('api_billing_snapshots')
      .select('*')
      .eq('api_name', cfg.api_name)
      .order('snapshot_at', { ascending: false })
      .limit(1);

    statuses.push({
      ...cfg,
      latest_snapshot: snaps && snaps.length > 0 ? snaps[0] : null,
    });
  }

  return { success: true, apis: statuses };
}

async function actionGetHistory(supabase: any, apiName: string, days = 30): Promise<any> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from('api_billing_snapshots')
    .select('api_name, usage_current, usage_limit, usage_pct, cost_usd, status, snapshot_at')
    .eq('api_name', apiName)
    .gte('snapshot_at', since)
    .order('snapshot_at', { ascending: true });

  if (error) return { error: error.message };
  return { success: true, api_name: apiName, history: data || [] };
}

async function actionUpdateConfig(supabase: any, apiName: string, updates: any): Promise<any> {
  // Only allow safe fields
  const allowed = ['warning_pct', 'critical_pct', 'depleted_pct', 'auto_recharge_enabled', 'auto_recharge_amount', 'notify_email', 'notify_push', 'notify_whatsapp', 'monthly_cost', 'budget_limit', 'is_active', 'notes'];
  const safeUpdates: Record<string, any> = {};
  for (const k of allowed) {
    if (updates[k] !== undefined) safeUpdates[k] = updates[k];
  }

  const { error } = await supabase.from('api_billing_config').update(safeUpdates).eq('api_name', apiName);
  if (error) return { error: error.message };

  // Log config change event
  await supabase.from('api_billing_events').insert({
    api_name: apiName,
    event_type: 'config_change',
    severity: 'info',
    message: `Config updated for ${apiName}: ${JSON.stringify(safeUpdates)}`,
    details: safeUpdates,
  });

  return { success: true };
}

async function actionUpdateManual(supabase: any, apiName: string, costUsd: number, notes?: string): Promise<any> {
  // For APIs without endpoints — admin manually enters current spend
  await supabase.from('api_billing_snapshots').insert({
    api_name: apiName,
    usage_current: costUsd,
    usage_limit: 0,
    usage_pct: 0,
    cost_usd: costUsd,
    status: 'manual',
  });

  // Also update monthly_cost in config
  await supabase.from('api_billing_config').update({ monthly_cost: costUsd }).eq('api_name', apiName);

  // Log event
  await supabase.from('api_billing_events').insert({
    api_name: apiName,
    event_type: 'manual_update',
    severity: 'info',
    message: `Manual spend entry: $${costUsd}` + (notes ? ` — ${notes}` : ''),
    details: { cost_usd: costUsd, notes },
  });

  return { success: true };
}

async function actionGetEvents(supabase: any, filters: any): Promise<any> {
  let query = supabase.from('api_billing_events').select('*').order('created_at', { ascending: false }).limit(filters.limit || 50);
  if (filters.api_name) query = query.eq('api_name', filters.api_name);
  if (filters.event_type) query = query.eq('event_type', filters.event_type);
  if (filters.unacknowledged) query = query.eq('acknowledged', false);

  const { data, error } = await query;
  if (error) return { error: error.message };
  return { success: true, events: data || [] };
}

async function actionAcknowledgeEvent(supabase: any, eventId: number, adminEmail: string): Promise<any> {
  const { error } = await supabase.from('api_billing_events').update({
    acknowledged: true,
    acknowledged_by: adminEmail,
    acknowledged_at: new Date().toISOString(),
  }).eq('id', eventId);

  if (error) return { error: error.message };
  return { success: true };
}

// ══════════════════════════════════════════════════
// MAIN SERVE
// ══════════════════════════════════════════════════

serve(async (req) => {
  initCors(req);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const rl = await checkRateLimit(req, { maxRequests: 30 });
  if (!rl.allowed) return rateLimitResponse(corsHeaders);

  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { action, admin_email, cron_secret, ...params } = body;

    // Auth: either admin_email or cron_secret
    const validCronSecret = Deno.env.get('CRON_SECRET');
    const isCron = validCronSecret && cron_secret === validCronSecret;

    if (!isCron) {
      if (!admin_email) return jsonResponse({ error: 'Authentication required' }, 401);
      const isAdmin = await verifyAdmin(supabase, admin_email);
      if (!isAdmin) {
        console.warn('[billing] Unauthorized:', admin_email);
        return jsonResponse({ error: 'Unauthorized' }, 403);
      }
    }

    // Route actions
    switch (action) {
      case 'check_all':
        return jsonResponse(await actionCheckAll(supabase));
      case 'check_one':
        return jsonResponse(await actionCheckOne(supabase, params.api_name));
      case 'get_status':
        return jsonResponse(await actionGetStatus(supabase));
      case 'get_history':
        return jsonResponse(await actionGetHistory(supabase, params.api_name, params.days));
      case 'update_config':
        return jsonResponse(await actionUpdateConfig(supabase, params.api_name, params.updates || {}));
      case 'update_manual':
        return jsonResponse(await actionUpdateManual(supabase, params.api_name, params.cost_usd, params.notes));
      case 'get_events':
        return jsonResponse(await actionGetEvents(supabase, params));
      case 'acknowledge_event':
        return jsonResponse(await actionAcknowledgeEvent(supabase, params.event_id, admin_email || 'cron'));
      default:
        return jsonResponse({ error: 'Unknown action: ' + action }, 400);
    }
  } catch (err) {
    console.error('[monitor-api-billing] error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: errMsg }, 500);
  }
});
