// Shared rate limiter — used by all Edge Functions
// Calls the check_rate_limit RPC in Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

export async function checkRateLimit(
  req: Request,
  opts: { maxRequests?: number; windowSeconds?: number } = {}
): Promise<{ allowed: boolean; remaining: number }> {
  const maxRequests = opts.maxRequests ?? 30;
  const windowSeconds = opts.windowSeconds ?? 60;

  // Build a key from IP + function path
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
  const path = new URL(req.url).pathname;
  const key = `${ip}:${path}`;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.error('[rate-limiter] RPC error:', error.message);
      // Fail closed — block requests if rate limiter is down (security over availability)
      return { allowed: false, remaining: 0 };
    }

    return {
      allowed: data.allowed,
      remaining: data.remaining,
    };
  } catch (err) {
    console.error('[rate-limiter] Exception:', err);
    return { allowed: false, remaining: 0 };
  }
}

export function rateLimitResponse(corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    }
  );
}
