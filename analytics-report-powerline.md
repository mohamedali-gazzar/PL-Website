# Analytics Report — powerlinei.com

**Site:** https://www.powerlinei.com/
**Report generated:** 2026-07-09
**Prepared by:** automated code + configuration audit

> ⚠️ **Read this first — data honesty notice.**
> This report contains **no invented numbers**. Live visitor/traffic figures are
> **not included** because, at the time of writing, **no analytics API access is
> configured** for this project and the analytics tools were **installed only days
> ago**. The exact reasons, the earliest date data can possibly exist, and the exact
> credentials required to unlock real numbers are documented in
> **§9 Problems / Missing Tracking** and **§11 How to unlock real data**.

---

## Data availability at a glance

| Source | Status in code | Collecting since | Can this report read its numbers? |
|---|---|---|---|
| **Google Analytics 4** (`G-MMBK1FRQLY`) | ✅ Installed via `@next/third-parties` in `app/layout.jsx` | **2026-07-07** | ❌ No — GA4 Data API access not configured (no service account / property ID / credentials) |
| **Vercel Web Analytics** (`@vercel/analytics`) | ✅ Installed in `app/layout.jsx` | **2026-07-06** | ❌ No — no Analytics API token/scope configured; free Web Analytics data isn't exposed to this environment |
| **Custom events** (clicks, form submits, calls) | ❌ None present | — | ❌ Nothing to read — not implemented |

**Key timeline facts (verified from git history):**
- Repository / build first created: **2026-06-14**
- Custom domain `www.powerlinei.com` went live: **~2026-07-06**
- Vercel Analytics deployed live: **2026-07-06**
- Google Analytics 4 deployed live: **2026-07-07**
- **Earliest date any analytics data can exist: 2026-07-06** (Vercel) / **2026-07-07** (GA4). There is **no historical data** for the period before these dates.

---

## 1. Executive Summary

| Metric | Value | Source | Notes |
|---|---|---|---|
| Total users / visitors | **N/A** | GA4 / Vercel | No API access; data only exists since 2026‑07‑06/07 |
| Total sessions | **N/A** | GA4 | No API access |
| Total page views | **N/A** | GA4 / Vercel | No API access |
| Average engagement time | **N/A** | GA4 | No API access |
| Main traffic sources | **N/A** | GA4 | No API access |
| Main countries / cities | **N/A** | GA4 / Vercel | No API access |
| Main devices | **N/A** | GA4 / Vercel | No API access |

**Key observations (what *can* be stated truthfully today):**
1. Analytics is **correctly installed and firing** on production — the GA4 `gtag` script (`googletagmanager.com/gtag/js?id=G-MMBK1FRQLY`) and the Vercel Analytics beacon both load on every page (verified live in the browser).
2. Analytics was added **after the site was already built/deployed**, so any traffic before **2026‑07‑06** is permanently unrecorded.
3. The dataset is currently **~2–3 days old**, so even once accessible it will be too small to draw trends from — treat the first ~2–4 weeks as a baseline-building period.
4. **No conversion/lead events are tracked** (see §8). Right now analytics only counts page views — it cannot tell you how many people called, emailed, or submitted a form.

---

## 2. Daily Visitors Report

**Status: Not available.** Requires GA4 Data API access (see §11). The report *would* populate the table below once access is granted; nothing is filled in to avoid guessing.

| Date | Visitors | Sessions | Page views |
|---|---|---|---|
| 2026-07-06 → 2026-07-09 | N/A | N/A | N/A |

- Highest-traffic day: **N/A**
- Lowest-traffic day: **N/A**
- Earliest day data can exist: **2026-07-06** (there is no daily data before this).

---

## 3. Traffic Sources

**Status: Not available** (no API access). Once data flows, GA4's *Reports → Acquisition → Traffic acquisition* will break this down. Categories GA4 will report:

| Channel | Value | Notes |
|---|---|---|
| Direct | N/A | Typically high early on (you sharing the link directly) |
| Organic Search | N/A | Depends on SEO indexing of powerlinei.com |
| Organic Social | N/A | Facebook / LinkedIn are linked in the footer |
| Referral | N/A | — |
| Paid / Paid Search | N/A | No ad tags detected in the codebase — likely none |
| Unassigned | N/A | Common until UTM tagging is used on shared links |

**Which source brings the most visitors:** cannot be determined without data.

---

## 4. Pages Performance

**Status: metrics Not available** (no API access). However, the **set of pages that will be measured** is known from the codebase (App Router routes):

| Route | Purpose |
|---|---|
| `/` | Home |
| `/about` | Who We Are |
| `/our-products`, `/low-voltage`, `/medium-voltage`, `/supplies` | Product / category pages |
| `/products/[slug]` | Individual product detail pages |
| `/locations` | Locations |
| `/contact` | Sales Request form |
| `/careers` | Careers / Join Our Team |
| `/supplier-offerings` | Suppliers Offerings form |

| Metric | Value |
|---|---|
| Most visited pages | N/A |
| Least visited pages | N/A |
| Entry pages | N/A |
| Exit pages | N/A |
| Bounce / engagement rate | N/A (GA4 tracks engagement rate once data exists) |
| Avg. time per page | N/A |

---

## 5. Visitor Location

**Status: Not available** (no API access). GA4 (*Reports → User → Demographics*) and Vercel Analytics both capture country/city once data accrues.

| | Value |
|---|---|
| Top countries | N/A |
| Top cities | N/A |
| Location patterns | N/A |

---

## 6. Device & Browser Report

**Status: Not available** (no API access). GA4 (*Reports → Tech*) and Vercel Analytics both capture device/browser/OS.

| | Value |
|---|---|
| Desktop vs Mobile vs Tablet | N/A |
| Top browsers | N/A |
| Top operating systems | N/A |
| Screen sizes | N/A (GA4 reports screen resolution) |

---

## 7. User Behavior

**Status: partial capability, no readable data.**

- **GA4 Enhanced Measurement** (on by default for new properties) will *automatically* collect, from 2026‑07‑07 onward: `page_view`, `scroll` (90% depth), `click` (outbound links), `site_search`, `form_start` / `form_submit`, `file_download`, `video_*`. These require no code.
- **No custom behavior events are implemented** in the code — so button clicks, phone clicks, email clicks, and specific form conversions are **not** individually tracked (see §8).
- **Values are unreadable** here because no GA4 API access is configured.

| Behavior | Tracked? | Readable here? |
|---|---|---|
| Page views | ✅ (GA4 + Vercel) | ❌ no API |
| Scroll depth | ✅ (GA4 Enhanced Measurement, if left enabled) | ❌ no API |
| Outbound link clicks | ✅ (GA4 Enhanced Measurement) | ❌ no API |
| Specific button clicks (CTAs) | ❌ not implemented | — |
| Contact form submissions | ❌ not implemented as an event | — |
| WhatsApp clicks | ❌ **no WhatsApp link exists on the site** | — |
| Phone (`tel:`) clicks | ❌ not implemented as an event | — |
| Email (`mailto:`) clicks | ❌ not implemented as an event | — |

---

## 8. Conversion / Lead Tracking

**Status: ❌ NOT TRACKED.** This is the most important gap. The site's real business goals — **Sales Requests, Supplier Offerings, job applications, phone calls, emails** — are **not being recorded as conversions**. Analytics currently only knows a page was viewed, not whether a lead was generated.

**What exists on the site (contact channels found in code):**
- Phone `tel:` links — in the footer, contact page, locations page, and product pages.
- Email `mailto:` links — shown in form fall-back messages.
- Three FormSubmit forms — `/contact` (Sales Request), `/careers`, `/supplier-offerings`.
- **No WhatsApp** channel anywhere in the codebase.

**Recommended events to add (exact list):**

| Event name (GA4) | Fire when | Where in code |
|---|---|---|
| `generate_lead` (params: `form: "sales_request"`) | Contact form submit succeeds (`status === "sent"`) | `app/contact/page.jsx` |
| `generate_lead` (params: `form: "supplier_offering"`) | Supplier form submit succeeds | `app/supplier-offerings/page.jsx` |
| `generate_lead` (params: `form: "job_application"`) | Careers form submit succeeds | `app/careers/page.jsx` |
| `contact_call` | Any `tel:` link click | Footer, Contact, Locations, product pages |
| `contact_email` | Any `mailto:` link click | Contact / form fall-back messages |
| `cta_click` (param: `label`) | Header CTAs (Sales Request, Become a Supplier, Join Our Team) | `components/Nav.jsx` |

**Implementation pattern** (using the already-installed `@next/third-parties`):

```jsx
import { sendGAEvent } from "@next/third-parties/google";

// e.g. after a successful contact submit:
sendGAEvent("event", "generate_lead", { form: "sales_request" });

// e.g. on a phone link:
<a href={`tel:${brand.phone}`} onClick={() => sendGAEvent("event", "contact_call")}>…</a>
```

Then mark `generate_lead` (and optionally `contact_call`) as **Key events (conversions)** in the GA4 UI (*Admin → Events → mark as key event*).

---

## 9. Problems / Missing Tracking

1. **No API access → this report cannot show numbers.** No GA4 Data API service account, property ID, or credentials are configured (verified: no relevant environment variables set). The numbers exist in the GA4 and Vercel dashboards, but not in a form this environment can query. See §11 for exactly what's required.
2. **Analytics was added *after* launch → historical traffic is lost.** Vercel Analytics live from **2026‑07‑06**, GA4 from **2026‑07‑07**. The site/repo existed from **2026‑06‑14**. **Any visits before 2026‑07‑06 were never recorded and cannot be recovered.**
3. **Dataset is only ~2–3 days old.** Even once accessible, there isn't enough data yet for meaningful trends. Revisit after 2–4 weeks.
4. **No conversion events (§8).** The site cannot currently attribute leads (calls, emails, form submits) to traffic sources — the single biggest reporting limitation for a lead-generation site.
5. **Two overlapping analytics tools.** GA4 and Vercel Analytics both run. That's fine (Vercel = quick privacy-friendly page-view/vitals overview; GA4 = deep analysis), but decide which is the "source of truth" to avoid confusion — numbers will differ slightly (different bot filtering / session logic).
6. **GA4 Measurement ID is hard-coded** (`G-MMBK1FRQLY` in `app/layout.jsx`). Works fine, but consider moving it to an env var (`NEXT_PUBLIC_GA_ID`) if you ever need staging vs production properties.

---

## 10. Final Recommendations

**Tracking (do first):**
- [ ] Add the **conversion events** in §8 (`generate_lead`, `contact_call`, `contact_email`, `cta_click`) and mark them as **Key events** in GA4.
- [ ] Confirm **GA4 Enhanced Measurement** is enabled (Admin → Data streams → the web stream) so scroll/outbound/form events are captured automatically.
- [ ] Set up **GA4 Data API access** (§11) so future reports can be generated automatically with real numbers.
- [ ] Optionally move the GA ID to `NEXT_PUBLIC_GA_ID`.

**Website / content (revisit once ~2–4 weeks of data exists):**
- Watch which **product pages** (`/low-voltage`, `/medium-voltage`, `/supplies`, `/products/[slug]`) get traffic and lead events — invest content/imagery in the winners; improve or de-emphasize the losers.
- Compare **`/contact` (Sales Request)** vs **`/supplier-offerings`** conversion rates; tune the higher-intent flow.
- If **organic search** is low, prioritise SEO (metadata is already set via `metadataBase`; add a sitemap/robots and per-page metadata).
- Use **UTM parameters** on any links you share (WhatsApp, email signatures, social posts) so "Unassigned/Direct" shrinks and attribution improves.

**Monitor weekly (once data flows):**
- Users, sessions, page views, engagement rate (GA4 Realtime + Acquisition).
- Key events / conversions: Sales Requests, Supplier Offerings, applications, calls, emails.
- Top landing pages and top exit pages.
- Device split (mobile vs desktop) and top countries/cities.
- Traffic source mix and any spikes/drops.

---

## 11. How to unlock real data (exact requirements)

You can get the numbers two ways:

**A. Read them yourself (available now, no setup):**
- **GA4:** analytics.google.com → property `G-MMBK1FRQLY` → *Reports → Realtime* (live) and *Reports → Acquisition / Engagement / Tech / Demographics* (data from 2026‑07‑07).
- **Vercel:** vercel.com → project **pl-website** → **Analytics** tab (data from 2026‑07‑06).

**B. Let this project generate reports automatically (requires setup):**
To query **GA4 Data API** programmatically, provide:
1. A **Google Cloud project** with the **“Google Analytics Data API”** enabled.
2. A **service account** in that project + its **JSON key** file.
3. That service account's email added as a **Viewer** on the GA4 property (Admin → Property Access Management).
4. The **numeric GA4 Property ID** (Admin → Property details — this is a number like `123456789`, *not* the `G-MMBK1FRQLY` measurement ID).
5. Expose them to the app/build as, e.g.:
   - `GA4_PROPERTY_ID=<numeric id>`
   - `GOOGLE_APPLICATION_CREDENTIALS=<path to the service-account JSON>` (or the JSON contents in a secret)

Vercel Web Analytics (free tier) does **not** offer a public data API; its numbers are dashboard-only. For programmatic traffic data, GA4 (option B) is the path.

---

*No figures in this report were estimated or invented. Every “N/A” reflects data that is genuinely not accessible from this environment as configured on 2026‑07‑09.*
