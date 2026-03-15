# GHL Team Handoff Checklist

Use this checklist for the non-code setup items that must be completed inside GoHighLevel.

## Core Setup

- [ ] Confirm one canonical GHL Location/Sub-account for all channels.
- [ ] Confirm website chat widget snippet URL for production.
- [ ] Confirm Conversation AI (call bot) is enabled on the production number.
- [ ] Confirm Facebook Page + Messenger are connected to the same location.
- [ ] Confirm contact dedupe is configured by phone + email.

## Attribution and Routing

- [ ] Create/confirm tags:
  - `fb_ads`
  - `website_chat`
  - `qr`
- [ ] Build automation rule to tag source from incoming payload `source`.
- [ ] Build fallback rule to parse `[Attribution] Source:` from notes if `source` is missing.
- [ ] Map source tags to pipeline/opportunity creation rules.

## Bot and Human Handoff Rules

- [ ] Business-hours routing configured (bot + human assignment).
- [ ] After-hours routing configured (bot + callback/SMS follow-up).
- [ ] Missed-call text-back workflow enabled.
- [ ] Escalation keywords route to human (billing, cancel, emergency, complaint).
- [ ] Fallback assignment if no rep is available.

## Acceptance Before Launch

- [ ] Test website chat contact creation in production location.
- [ ] Test inbound call bot capture in production location.
- [ ] Test Facebook Messenger thread ingestion in production location.
- [ ] Verify all three channels merge into one contact when identifiers match.
