# GHL Launch Monitoring (First 48 Hours)

Use this runbook during the first 48 hours after enabling chat/call bot in production.

## Hour 0-2 (Immediate)

- [ ] Confirm GHL chat widget loads on production routes.
- [ ] Confirm no overlap with mobile quote CTAs.
- [ ] Place one test chat and one test call; confirm both create/append to contacts.
- [ ] Verify payload fields appear:
  - `source`
  - `source_detail`
  - `landing_path`
  - `referrer`
  - UTM fields when available

## Hour 2-12 (Stability)

- [ ] Sample 10 inbound conversations across channels for routing correctness.
- [ ] Check failed webhook/error logs and resolve mapping issues.
- [ ] Verify dedupe behavior for repeated contacts.
- [ ] Verify after-hours automation and missed-call text-back performance.

## Hour 12-24 (Conversion Health)

- [ ] Compare conversion rates by source tag (`fb_ads`, `website_chat`, `qr`).
- [ ] Check average response time and handoff latency.
- [ ] Confirm no spikes in abandoned chat sessions.
- [ ] Confirm no agent overload from failed escalations.

## Hour 24-48 (Optimization)

- [ ] Tune opening bot prompts based on drop-off points.
- [ ] Tune escalation keyword list.
- [ ] Tune routing by campaign/source.
- [ ] Publish final status update with:
  - issue list
  - fixes applied
  - remaining actions

## Rollback Triggers

Temporarily disable widget/bot if any of the following occur:

- CTA obstruction causes quote flow drop-off.
- Incorrect routing sends high-volume leads to dead queue.
- Duplicate contact creation exceeds accepted threshold.
- Automation loops or spam outputs are observed.
