# External Link Audit

Audit date: 2026-07-06

Scope: external official links from `book-resources-data.js` book resource cards, `resources-data.js`, and `resources-seed-expanded.js`. Network checks were run against each unique external URL and mapped back to every resource entry.

## Summary

- Total resource link entries checked: 176
- Unique external URLs checked: 61
- Passed link entries: 159
- Redirected link entries: 9
- Failed link entries: 17
- Timeout link entries: 0
- Suspicious link entries: 0
- Unique passed URLs: 53
- Unique redirected URLs: 6
- Unique failed URLs: 8
- Unique timeout URLs: 0
- Unique suspicious URLs: 0

## Fixes Applied During This Pass

- Replaced old Tennessee 211 resource-directory URL with `https://www.uwtn.org/tn-211` after the old host redirected to WellSky.
- Replaced JetBlue's old military travel URL with `https://www.jetblue.com/flying-with-us/military-customers` after the old URL returned 404.

## Public Card Checks

- Book resource safety note rows visible in `resources.html`: 171
- Book resource phone rows visible in `resources.html`: 171
- Book resource official website rows visible in `resources.html`: 171
- Book resource date checked rows visible in `resources.html`: 171
- `No phone listed` phone rows in `resources.html`: 66
- `N/A` phone rows in `resources.html`: 32
- Literal `No phone` displayed as a standalone phone value: No

Recommendation on phone wording: `No phone listed` and `N/A` are non-number phone values. They are not broken links, but consider changing public card wording to `Phone: Use official website` or hiding the phone row when the source package has no phone.

## Failed Links

| File | Resource ID | Resource | URL | Status | Issue | Recommended fix |
|---|---|---|---|---:|---|---|
| resources-seed-expanded.js | seed-idme | ID.me | https://www.id.me/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |
| book-resources-data.js | book-step | STEP | https://step.state.gov/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |
| book-resources-data.js | book-dod-skillbridge | DoD SkillBridge | https://skillbridge.mil/ | fetch failed | Fetch error: fetch failed | Recheck manually in browser; if repeated, replace with a current official URL from the same organization. |
| book-resources-data.js | book-esgr | ESGR | https://www.esgr.mil/ | fetch failed | Fetch error: fetch failed | Recheck manually in browser; if repeated, replace with a current official URL from the same organization. |
| book-resources-data.js | book-dod-skillbridge-2 | DoD SkillBridge | https://skillbridge.mil/ | fetch failed | Fetch error: fetch failed | Recheck manually in browser; if repeated, replace with a current official URL from the same organization. |
| book-resources-data.js | book-dod-skillbridge-3 | DoD SkillBridge | https://skillbridge.mil/ | fetch failed | Fetch error: fetch failed | Recheck manually in browser; if repeated, replace with a current official URL from the same organization. |
| book-resources-data.js | book-mypay | myPay | https://mypay.dfas.mil/ | 451 | HTTP 451 | Replace with the current official page for this resource. |
| book-resources-data.js | book-mypay-2 | myPay | https://mypay.dfas.mil/ | 451 | HTTP 451 | Replace with the current official page for this resource. |
| book-resources-data.js | book-mypay-3 | myPay | https://mypay.dfas.mil/ | 451 | HTTP 451 | Replace with the current official page for this resource. |
| book-resources-data.js | book-va-caregiver-support-program | VA Caregiver Support Program | https://www.caregiver.va.gov/ | fetch failed | Fetch error: fetch failed | Recheck manually in browser; if repeated, replace with a current official URL from the same organization. |
| book-resources-data.js | book-taps | TAPS | https://www.taps.org/ | fetch failed | Fetch error: fetch failed | Recheck manually in browser; if repeated, replace with a current official URL from the same organization. |
| book-resources-data.js | book-score | SCORE | https://www.score.org/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |
| book-resources-data.js | book-id-me | ID.me | https://www.id.me/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |
| book-resources-data.js | book-id-me-2 | ID.me | https://www.id.me/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |
| book-resources-data.js | book-id-me-3 | ID.me | https://www.id.me/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |
| book-resources-data.js | book-id-me-4 | ID.me | https://www.id.me/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |
| book-resources-data.js | book-id-me-5 | ID.me | https://www.id.me/ | 403 | HTTP 403 | Manually verify in browser; if publicly blocked, consider linking to a higher-level official page. |

## Timeout Links

_None._

## Suspicious Links

_None._

## Data / Visibility Issues

_None._

## Redirected Links

| File | Resource ID | Resource | Original URL | Final URL | Status |
|---|---|---|---|---|---:|
| resources-seed-expanded.js | seed-nrd-master | National Resource Directory | https://www.nrd.gov/ | http://nrd.gov/ | 200 |
| resources-seed-expanded.js | seed-laet | Legal Aid of East Tennessee | https://www.laet.org/ | https://laet.org/ | 200 |
| book-resources-data.js | book-u-s-department-of-state-help-abroad | U.S. Department of State Help Abroad | https://travel.state.gov/content/travel/en/international-travel/emergencies.html | https://travel.state.gov/en/international-travel/help-abroad.html | 200 |
| book-resources-data.js | book-doj-scra-guide | DOJ SCRA Guide | https://www.justice.gov/servicemembers/servicemembers-civil-relief-act-scra | https://www.justice.gov/servicemembers/resources | 200 |
| book-resources-data.js | book-cfpb-military-lending-act-resources | CFPB Military Lending Act Resources | https://www.consumerfinance.gov/consumer-tools/educator-tools/servicemembers/military-lending-act-mla/ | https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/military-lending-act-mla/ | 200 |
| book-resources-data.js | book-legal-services-corporation | Legal Services Corporation | https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help | https://www.lsc.gov/about-lsc/what-legal-aid/i-need-legal-help | 200 |
| book-resources-data.js | book-doj-scra-guide-2 | DOJ SCRA Guide | https://www.justice.gov/servicemembers/servicemembers-civil-relief-act-scra | https://www.justice.gov/servicemembers/resources | 200 |
| book-resources-data.js | book-cfpb-military-lending-act-resources-2 | CFPB Military Lending Act Resources | https://www.consumerfinance.gov/consumer-tools/educator-tools/servicemembers/military-lending-act-mla/ | https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/military-lending-act-mla/ | 200 |
| book-resources-data.js | book-u-s-department-of-state-help-abroad-2 | U.S. Department of State Help Abroad | https://travel.state.gov/content/travel/en/international-travel/emergencies.html | https://travel.state.gov/en/international-travel/help-abroad.html | 200 |

## Method Notes

- A link was counted as pass when the final network response was 200-399 and did not redirect to a different organization host.
- Redirects within the same host family, such as adding or removing `www`, were counted as redirected but not suspicious.
- Some official sites block automated HEAD requests, so the audit retried with GET before marking a failure.
- HTTP 403 is reported as failed for this audit even when it may be bot protection, because the requirement explicitly called out 403.
