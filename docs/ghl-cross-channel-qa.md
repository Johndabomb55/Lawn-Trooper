# Cross-Channel QA Matrix

Run this checklist jointly (web + GHL team) before launch.

## Preconditions

- GHL widget script URL is set in environment variable:
  - `VITE_GHL_CHAT_WIDGET_SRC`
- Optional route hide list is set if needed:
  - `VITE_GHL_CHAT_HIDE_ROUTES` (comma-separated, default includes `/embed`)
- GHL webhook URL is set:
  - `GHL_WEBHOOK_URL`

## Website UX QA

- [ ] Desktop: chat bubble appears and does not block wizard CTA buttons.
- [ ] Mobile: chat bubble is offset and does not block sticky banner/CTA.
- [ ] `/embed` route: chat widget is hidden (route-safe behavior).
- [ ] Main routes (`/`, `/quote-wizard`, `/simple`): chat widget loads once.

## Data and Attribution QA

- [ ] Submit MultiStep quote from URL with `utm_source=facebook`.
  - Expect `source=fb_ads` in GHL payload or attribution note.
- [ ] Submit Streamlined lead from URL with `?qr=1`.
  - Expect `source=qr` in GHL payload or attribution note.
- [ ] Submit direct/organic lead with no UTM.
  - Expect `source=website_chat` in GHL payload or attribution note.
- [ ] Confirm `landing_path`, `referrer`, and UTM fields are visible in GHL where mapped.

## Channel Merge QA

- [ ] Start web chat, then call from same phone number.
  - Expect a single merged GHL contact.
- [ ] Start FB Messenger, then website chat with same email/phone.
  - Expect unified conversation timeline (or deterministic merge rule).

## Pass Criteria

- No blocked CTA interactions on mobile/desktop.
- Source tags and attribution appear consistently.
- Channel conversations merge under one contact when IDs match.
