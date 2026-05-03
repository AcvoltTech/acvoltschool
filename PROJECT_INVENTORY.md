# Maestro HVACR — Project Inventory & Valuation

**Owner:** Mario Flores (ACVOLT Tech School)
**Domain:** maestrohvacr.com
**Snapshot date:** 2026-04-25
**Document purpose:** Complete inventory of platform capabilities, integrations, and asset valuation for internal reference and external stakeholders (partners, investors, advisors).

---

## Executive summary

Maestro HVACR is a Spanish-language HVAC certification training platform delivered as a multi-platform SaaS (web PWA, iOS WKWebView, Android TWA). It integrates four product surfaces in a single bilingual application:

1. **Certification training** — EPA 608, OSHA 30, NATE Core/Senior, A2L, refrigeration, heating, contractor licensing (CA CSLB C-10/C-20/C-38/Law)
2. **Live education infrastructure** — instructor-led HLS streaming with real-time chat, attendance, recording, and voice rooms
3. **P2P marketplace** — verified-seller classified board for HVAC tools, parts, and services
4. **Contractor business toolkit** — Jornal Pro (work log + GPS mileage + check-in clock) and full invoicing module (clients → orders → invoices → expenses)

All four are layered on a single Supabase backend with 47 edge functions, 169 PostgreSQL tables, and 13 production integrations.

---

## Scale at a glance

| Layer | Count |
|---|---|
| Edge Functions (Supabase) | **47** |
| Frontend JS modules | **~140+** (tier 0 / tier 1 / lazy) |
| PostgreSQL tables | **169** across 11 business domains |
| User-facing screens & admin panels | **68** |
| Curated certification questions | **~6,500+** across 16 exams |
| Contractor licensing content | **1.2 MB** (CA CSLB) |
| Tool / parts reference data | **~800 KB** |
| External integrations | **13 services** |
| Platforms shipped | **3** (web prod + iOS WKWebView + Android TWA) |
| Languages | **2** (Spanish + English) |

---

## Inventory by business domain

### Payments / IAP — 7 edge functions
- Stripe checkout (monthly / annual / proctored exam fees)
- `stripe-webhook` with HMAC-SHA256 signature verification, replay protection, constant-time compare, idempotency dedup
- Auto-recharge at billing thresholds
- Admin revenue dashboard (MRR, churn, failed-charge recovery)
- Membership verification cross-check with Stripe source-of-truth
- RevenueCat integration ready for iOS App Store IAP

### Content & study — 14 DB tables, 16 certification modules
- **EPA 608** — 500 questions + study guide
- **OSHA 30-Hour Safety** — 769 questions across 8 modules
- **NATE Core** — 749 questions
- **NATE Senior** — 1,000 questions
- **A2L (flammable refrigerants)** — 400 questions
- **Calefacción (heating, Spanish)** — 692 questions
- **Refrigeración** — 700 questions
- **ET Card (Electrician Trainee)** — 700 questions
- **Desafío Maestro (gamified)** — 750 curated "Aprendiz" questions
- **Contractor Zone (CA CSLB)** — 13 instructional blocks + ~600 questions for C-10, C-20, C-38, and Law
- **ACVOLT Courses** — 17 courses · 105 sections · 427 lessons · 542 quiz questions

### Live streaming — 9 DB tables, 4 edge functions
- 100ms HLS broadcast pipeline (instructor + viewers)
- Cloudflare Stream for VOD recording and playback
- Real-time chat with moderation, bans, and pinned messages
- Automatic attendance tracking with duration measurement
- Multistream destinations (simultaneous broadcast to YouTube, Facebook, etc.)
- Self-healing cron at 60-second cadence to repair stale playback URLs
- Permanent live input for reusable RTMPS endpoints

### AI / Claude — 11 edge functions on Anthropic API
- **Maestro Mario** — 24/7 student tutor
- **Instructor AI** — assistant for teachers (grading, feedback)
- **Auto-grading** of HVAC project submissions via Claude Vision
- **Question generator** from PDFs / images / summaries
- **HVAC News Feed** — RSS ingestion, Spanish translation, Claude summarization
- **Subtitle generator** (Deepgram + Claude)
- **Video quiz generator** for ACVOLT lessons
- **AI Doctor** + **Morning Briefing** (analyzer-only health monitoring)
- **Voice synthesis** via ElevenLabs
- **Content moderation** via Claude Vision

### Admin / CRM / Student Success — 35+ admin panels
- **Finanzas** — Stripe revenue dashboard, failed-charge → ticket pipeline
- **Student Success** — ticket system with risk flagging and intervention tools
- **Analytics** — 6 tabs (DAU/WAU, retention, engagement, profile, churn, feature usage)
- **AI Command Center** — daily Claude-generated triage briefing
- **Embajadores** — referral program with commission tracking
- **Clases** — schedule, enrollment caps, Zoom integration
- **Emails** — bulk campaigns, templates, delivery logs
- **Gestión de Chats** — moderation, bans, archive
- **Monitor de Usuarios** — live activity, device info, sessions
- **Notificaciones** — push broadcaster with segment targeting
- **Gatekeeper** — roles, feature flags, IP whitelisting
- **System Health** — uptime, DB performance, API latency
- **Web Vitals** — CLS / LCP / FID analytics
- **API Billing** — centralized cost tracking across 10 third-party APIs

### HVAC tools — 51 specialized calculators
- PT charts for all major refrigerants (R-410A, R-32, R-454B, R-22, etc.)
- Manometer, anemometer, multimeter (with BLE Fieldpiece integration)
- Heat pump diagnostics (heating/cooling modes, defrost, aux heat)
- Commercial HVAC (chillers, RTUs, VAV/VRF)
- Duct designer with canvas tool and real-time velocity tracking
- Maestro Bender (duct bend calculator)
- **Maestro Pro** — 51 tools across math, electrical, HVAC, refrigeration, NEC, safety
- Parts Finder with AI fallback
- Pre-departure checklist
- HVAC PDF report generator

### BLE / Fieldpiece integration
- iOS WKWebView ↔ native bridge via `webkit.messageHandlers` (~2,050 LOC)
- Supports **SM480V**, **SC680**, **JL3RH**, **FP4258** Fieldpiece devices
- Auto-populate of tool fields with visual feedback
- Web Bluetooth fallback for browsers (with documented Chrome Android limitations)

### Monitoring & operational health
- **System Sentinel** — every 5 min, 22 subsystem checks
- **AI Doctor** — every 30 min, analyzer-only diagnosis
- **Morning Briefing** — daily 6 AM PDT, Claude-generated triage email
- **Daily Summary** — 7 AM, 24h health digest
- **iOS crash poller** — App Store Connect API
- **Android crash poller** — Google Play Developer Reporting API
- **Security audit daily** — 5 AM PDT, probes 8 attack vectors, emails on regression only

### Marketplace — 8 DB tables
- P2P classifieds for HVAC tools, parts, and services
- Verified sellers ($49.99 fee, government ID verification)
- Bilateral reviews and report system
- In-app messaging between buyer and seller
- Voice calls via 100ms between buyer and seller
- Wishlist and saved items

### Invoicing / Jornal Pro — 4 DB tables
- Client management
- Work order workflow (pending → in_progress → completed)
- Invoice generation with tax, items, status (draft/sent/paid)
- Expense tracker categorized by parts, tools, gas, insurance
- **Jornal Pro** — daily work log with GPS mileage, check-in clock, fuel tracker, daily quotas

### Support — videos, manuals, ticketing
- Soporte tickets with priority and assignment
- Training video library
- Tech documentation with versioning

---

## External integrations — 13 production services

| Service | Capability |
|---|---|
| **Stripe** | Subscriptions, IAP, webhooks (signature-verified) |
| **Supabase** | PostgreSQL + Auth + 47 Edge Functions |
| **Anthropic Claude** | 11 AI features |
| **100ms Live** | Live video, chat, voice rooms |
| **Cloudflare Stream** | HLS recording + VOD playback |
| **Resend** | Transactional and bulk email |
| **Google APIs** | OAuth, Drive, Maps |
| **App Store Connect API** | iOS crash polling |
| **Google Play Developer Reporting API** | Android crash polling |
| **Fieldpiece BLE** | HVAC instrument data ingestion |
| **ElevenLabs** | TTS for AI tutor voice |
| **Deepgram Nova-3** | Video transcription |
| **Web Push (VAPID)** | Notifications for web and Android |

---

## Mobile / native footprint

- **iOS**: WKWebView wrapper loading `maestroac-app-clon.pages.dev`, with native bridges for BLE (~1,400 LOC), haptics (Taptic Engine), App Store IAP UI gating, and debug overlay. Native code lives outside this repo in a separate Xcode project.
- **Android**: TWA configuration with `com.maestromario.twa` package and Digital Asset Links (`assetlinks.json`). SHA256 cert published. Native AAB ready but Play Store launch deferred to second phase.
- **Push notifications**: Web Push for web/Android via VAPID; iOS uses APNs via the native wrapper.
- **Crash reporting**: TestFlight crashes via App Store Connect API; Play crashes via Google Play Developer Reporting API. Both write to `native_crashes` table.

---

## Valuation perspectives

### Replacement cost (agency build)
At market rates of **$150–$200 USD/hour**, the build effort to replicate this platform from scratch is approximately:

| Component | Estimated hours |
|---|---|
| Frontend (~140 modules) | 1,100 |
| Backend edge functions (47) | 280 |
| Database schema, migrations, RLS | 250 |
| Mobile bridges + BLE | 400 |
| AI integrations (11 features) | 200 |
| Live streaming infrastructure | 300 |
| Content curation (~6,500 questions) | 500 |
| QA, testing, deployment | 400 |
| **Total** | **~3,400 hours** |

→ **Agency rebuild: $510,000 – $680,000 USD**
→ Mid-level developer in LATAM ($60–$80/hr): **$200,000 – $275,000 USD**

### SaaS revenue valuation
Pricing tiers in production:
- **Standard** — $59.99/month
- **VIP** — $149.99/month (live classes included)

| Scenario | MRR | ARR | Valuation @ 3–5× ARR |
|---|---|---|---|
| 200 paying users mixed | ~$12K | ~$144K | $432K – $720K |
| 500 paying users mixed | ~$45K | ~$540K | $1.6M – $2.7M |
| 1,000 paying users mixed | ~$90K | ~$1.08M | $3.2M – $5.4M |

### Defensible asset value
- **Curated bilingual question bank** (~6,500 items) — 2–3 years of domain-specific content work; replacement cost in test-prep industry is $20–$50 per professional question = **$130K – $325K in content asset alone**.
- **Fieldpiece BLE integration** — no direct competitor in HVAC training apps offers this.
- **Production-grade live streaming pipeline** (100ms + Cloudflare Stream + chat + recording) — most education competitors fall back to Zoom because they cannot build this.
- **Spanish-language HVAC AI tutor** — content + pedagogical barrier, not only technical.
- **Underserved market** — HVAC training in Spanish for US Latino technicians has high demand and limited competition.

---

## Security posture (as of 2026-04-25)

Hardening completed in this iteration:
- ✅ 3 orphan tables locked with RLS RESTRICTIVE policies (`manual_payments`, `student_payments`, `email_log`)
- ✅ Privilege escalation closed on `admin_staff` (anon INSERT now blocked)
- ✅ Cron-only AI functions secured with shared-secret header (`ai-doctor`, `ai-morning-briefing`)
- ✅ Stripe webhook professional-grade signature verification (HMAC-SHA256, replay protection, timing-safe compare, event whitelist, idempotency)
- ✅ System Sentinel cleaned of false-positive WARN noise
- ✅ Daily security audit cron deployed (jobid=15, 5 AM PDT) probing 8 attack vectors

Hardening planned for post-store-approval:
- Phase 2/3 RLS lockdown on `users`, `memberships`, `payment_records`, `payment_intents`, `profiles`, and ~107 other tables (requires refactor of client reads to edge-function gateways)
- Cloudflare WAF + bot rules
- Auth hardening (session expiry, password reset rate limiting)

---

## Notes for partners and investors

The platform is at the inflection point between **MVP-validated** and **production-launched**. Web is in production (`maestrohvacr.com`); iOS is in TestFlight; Android is in Play Store closed testing pending production approval (~April–May 2026).

The technical foundation is substantially more robust than founder-built apps typically are at this stage, in part because the build was done in pair-programming with Anthropic's Claude over a 3-month period. Tech debt exists (some RLS policies are still permissive on high-traffic tables), and a security hardening sweep is in progress to close those gaps before broader public exposure.

Owner contact: Mario Flores · floresmario30@hotmail.com
