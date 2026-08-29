# Weekly Vercel Analytics

This file is the running weekly analytics log for `mikhailkirs.com`. Each Saturday, add a new weekly block and compare it with the previous period.

## Week 01 — August 22–29, 2026

**Source:** Vercel Web Analytics CSV exports  
**Export window:** Aug 22, 05:00 → Aug 29, 05:59  
**Status:** baseline week; no week-over-week comparison yet

### KPI snapshot

| Metric | Value | Note |
| --- | ---: | --- |
| Visitors | **18** | Baseline only; setup/testing traffic is included |
| Page views | **30** | Across all exported pages |
| Page views per visitor | **1.67** | 30 / 18 |
| Desktop visitors | **11 (61.1%)** | 18 page views |
| Mobile visitors | **7 (38.9%)** | 12 page views |
| Google referrals | **3 visitors / 4 views** | First clear search-origin traffic in this export |

### Top pages

| Page | Visitors | Page views | Share of page views |
| --- | ---: | ---: | ---: |
| `/` | **14** | **21** | **70.0%** |
| `/personal-brand.html` | **6** | **7** | **23.3%** |
| `/index.html` | 1 | 1 | 3.3% |
| `/project-city-storytelling.html` | 1 | 1 | 3.3% |

> `/` and `/index.html` are the same homepage content but Vercel records them as separate paths. Do not add their visitor counts together because the same person may appear in both.

### Referrers

| Referrer | Visitors | Page views |
| --- | ---: | ---: |
| `google.com` | **3** | **4** |
| `vercel.com` | 2 | 2 |
| `facebook.com` | 1 | 1 |

The referrer export lists 6 visitors and 7 page views. The remaining traffic is not attributed to one of the listed referrers in this export; it should not automatically be treated as fully organic or direct traffic.

### Countries

| Country | Visitors | Page views | Visitor share |
| --- | ---: | ---: | ---: |
| Serbia (`RS`) | **8** | **15** | **44.4%** |
| United States (`US`) | **7** | **9** | **38.9%** |
| Brazil (`BR`) | 2 | 2 | 11.1% |
| Canada (`CA`) | 1 | 4 | 5.6% |

### Devices and operating systems

| Device | Visitors | Page views |
| --- | ---: | ---: |
| Desktop | **11** | **18** |
| Mobile | **7** | **12** |

| Operating system | Visitors | Page views |
| --- | ---: | ---: |
| Windows | **6** | 8 |
| Mac | **5** | **10** |
| iOS | **4** | 8 |
| Android | **3** | 4 |

### Analysis

1. **This is a calibration week, not yet a growth trend.** The site and analytics were actively being configured and tested during the period. Vercel itself accounts for 2 visitors / 2 views, and additional internal testing can be mixed into direct or country traffic. The headline number of 18 visitors should therefore not be treated as 18 independent external prospects.

2. **Google is already producing measurable traffic.** `google.com` sent 3 visitors and 4 page views. For a newly indexed portfolio this is the most encouraging acquisition signal in the first export. The priority is to watch whether Google referrals rise after the recent SEO and LinkedIn updates are recrawled.

3. **The homepage is doing the expected discovery work.** It generated 21 of 30 page views (70%). The important next question is whether more homepage visitors continue into project pages.

4. **Personal Brand is the strongest secondary page.** `/personal-brand.html` reached 6 visitors and 7 page views. This is the clearest sign so far that the municipal campaign / personal-brand case is attracting attention beyond the homepage.

5. **The other project pages do not yet have enough traffic for conclusions.** Long Form Visual Storytelling has one recorded visit and Local Business Storytelling does not appear in this export. With a sample this small, no navigation or content change should be made on that basis alone.

6. **Mobile matters already.** 7 of 18 visitors (38.9%) were on mobile and mobile generated 40% of page views. Mobile QA should remain part of every significant site change.

7. **Geography is not clean enough yet to judge audience composition.** The country table is useful as a baseline, but setup/testing traffic means the Serbia share in particular should not yet be interpreted as market demand. Canada shows only one visitor, although that visitor generated four page views.

### Summary

**Week 01 establishes a healthy technical baseline, not an audience-growth verdict.** The strongest early signals are that Google has begun sending visitors, the homepage is being discovered, and Personal Brand is already the most-viewed project page. The main analytical problem is internal/testing traffic, which needs to be reduced before week-over-week traffic quality can be judged confidently.

### Action before Week 02

- Exclude browsers/devices used for site administration and testing from Vercel Analytics. The site already supports this: open `https://www.mikhailkirs.com/?analytics=off` once in every browser/device used for testing. That browser will keep the analytics opt-out in local storage. Use `?analytics=on` to re-enable it.
- Do **not** change page structure based on this first-week sample.
- Next Saturday compare: visitors, page views, views per visitor, Google referrals, Personal Brand traffic, desktop/mobile split, and Canada/US traffic.
- If a Google Search Console export is available next week, add impressions, clicks, CTR, queries and landing pages to the same weekly review.

### Week-over-week tracker

| Metric | Week 01 | Week 02 | WoW |
| --- | ---: | ---: | ---: |
| Visitors | 18 | — | — |
| Page views | 30 | — | — |
| Page views / visitor | 1.67 | — | — |
| Google referral visitors | 3 | — | — |
| Personal Brand visitors | 6 | — | — |
| Desktop share | 61.1% | — | — |
| Mobile share | 38.9% | — | — |
| Canada visitors | 1 | — | — |
| United States visitors | 7 | — | — |
