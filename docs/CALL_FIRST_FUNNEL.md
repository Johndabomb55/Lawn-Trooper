# Call-first funnel — Lawn Trooper

## Strategy (summary)

- **Call-first, not call-only.** Fastest conversion = voice/SMS to **Lawn Trooper AI** (24/7). Human team follows up in business hours.
- **Secondary:** text, email callback request, then **plan builder** (`/`, `#quote`, `/quote-wizard`) for visual + instant pricing.
- **Do not** lead with discounts or per-cut math on the public hero.
- **Core plans:** keep **Standard Patrol**, **Premium Patrol**, **Executive Command** and existing price ladder from `plans.ts` / live content.
- **Reframe publicly** as **annual membership, billed monthly**; loyalty/anniversary rewards stay deeper in funnel (wizard, promos page).

## Wireframe (homepage / `/start`)

```
┌─────────────────────────────────────────┐
│ [Logo]  Nav …  [Call AI] [Plan builder] │
├─────────────────────────────────────────┤
│ HERO (billboard)                        │
│ Headline + 1-line membership framing    │
│ [PRIMARY: Call Lawn Trooper AI]         │
│ [Text us] [Request callback]            │
│ “Prefer visual? → Open plan builder”    │
│ (optional compact promo / trust chips)  │
├─────────────────────────────────────────┤
│ HOW IT WORKS (3 steps) — call → confirm │
│ → schedule / walkthrough                │
├─────────────────────────────────────────┤
│ OFFER LANES (2 cards)                   │
│ Curb Appeal Plan | 30-Day Yard Reset    │
├─────────────────────────────────────────┤
│ TRUST + SERVICE AREA                    │
├─────────────────────────────────────────┤
│ PLAN BUILDER SECTION (#quote)           │
│ (unchanged wizard)                      │
├─────────────────────────────────────────┤
│ … rest of page / FAQ …                  │
└─────────────────────────────────────────┘
```

## Pricing / offer architecture (notes)

| Lane | Positioning | Notes |
|------|-------------|--------|
| Standard / Premium / Executive | Core recurring membership | Prices unchanged in code; public copy = annual membership, billed monthly. |
| Curb Appeal Plan | Premium, scope-based | Front / high-visibility only; price lower due to **less ground**, not lower standard. |
| 30-Day Yard Reset | Premium trial | Full-price, scope-defined; reset fee + materials separate when needed. |
| Special / material-heavy | Custom quote or member add-on | Never implied unlimited in flat packages. |

## Lawn Trooper AI — phone script (operator / IVR / AI)

**Opening:**  
“Thanks for calling Lawn Trooper. You’re speaking with Lawn Trooper AI — I can help with membership options, what’s included, and how we work in North Alabama. For scheduling and contracts, our team follows up during business hours.”

**Branching:**

1. **New customer / pricing**  
   - “We offer annual membership billed monthly: Standard Patrol, Premium Patrol, and Executive Command. I can summarize what’s included and typical cadence. Exact fit is confirmed on a quick property walkthrough or your plan builder online.”

2. **Curb Appeal / partial property**  
   - “We have a Curb Appeal Plan focused on front and high-visibility areas — pricing reflects a defined scope, not a cut in quality.”

3. **Overgrown / one-time feel**  
   - “Our 30-Day Yard Reset is a defined-scope reset, full price, no gimmick trial. Heavy catch-up may need a separate reset fee; mulch and specialty items are quoted separately.”

4. **Callback / human**  
   - “I’ll note your number and intent. You can also text this number or use Request a callback on our site — we’ll reach out within one business day.”

5. **Emergency**  
   - “For urgent safety or property damage, I’ll flag this for the team. If this is a life-safety emergency, please hang up and dial 911.”

**Close:**  
“Anything else about membership or next steps? Thanks for choosing Lawn Trooper.”

**Full voice/SMS spec:** see [`LAWN_TROOPER_AI_CONVERSATION.md`](./LAWN_TROOPER_AI_CONVERSATION.md) (flows, handoff, SMS templates, dispositions, production system prompt).

## Implementation plan (completed in repo)

- `client/src/data/callFirst.ts` — phone, tel/sms hrefs, copy constants.
- `client/src/data/content.ts` — `HERO_CONTENT`, `PLAN_SUMMARIES` subtitle, and “Why” AI bullet aligned with Lawn Trooper AI (also feeds `simple-home.tsx`).
- `client/src/pages/home.tsx` — call-first hero + offer lanes; anniversary promo sits **above `#quote`** (not above hero); builder preserved.
- `client/src/pages/call-first.tsx` — full call-first LP at `/start` (conversion-focused hero, builder above first repeated CTA, when-you-call, how-it-works, core plans, “Not ready” section with Curb Appeal + Yard Reset, trust + lead line, FAQ, quick answers, HOA + special requests, repeated CTAs, mobile sticky bar). Copy: `CALL_FIRST_LANDING_COPY`, `CALL_FIRST_BUILDER_COPY`, `CALL_FIRST_CURB_SECTION`, `CALL_FIRST_RESET_SECTION`, `CALL_FIRST_ALTERNATE_START`, option arrays, `CALL_FIRST_TONE_VARIANTS`, `getCallFirstHeroCopy()` in `callFirst.ts`.
- `client/src/components/SiteHeader.tsx` — Call AI + secondary plan builder.
- `client/src/App.tsx` — route `/start`.

## QA checklist

- [ ] `tel:` and `sms:` links open correctly on iOS and Android.
- [ ] Primary hero CTA fires `call_funnel` analytics (and quote-section tel link if used).
- [ ] Anniversary promo is **not** above the hero headline; it appears above `#quote` (dismiss persists per `lt_anniversary_builder_compact_dismissed`).
- [ ] “Open plan builder” reaches `/quote-wizard` or `#quote` as intended.
- [ ] “Request callback” opens mailto with subject/body.
- [ ] Plan names and prices in wizard match `plans.ts` (unchanged).
- [ ] No “Yard Agent” in new public copy.
- [ ] GHL chat still loads (widget).
- [ ] `/start` loads without console errors; links back to `/` and builder work.
- [ ] `/start` mobile sticky bar: Call AI, text, Builder; content not hidden behind bar (`pb-28` on page).
- [ ] `/start` analytics: `call_first_lp` plus legacy `call_first_tel` / `sms` / `callback` / `builder` where applicable.
