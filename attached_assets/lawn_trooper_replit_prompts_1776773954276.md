# Lawn Trooper Replit Prompts

## Prompt 1 — Plan / Build Prompt

```text
Plan mode.

Read the existing Lawn Trooper repo first, then create and implement a fix plan for the live website.

Main goal:
Make thelawntrooper.com simpler, cleaner, more conversion-focused, and more consistent with the new homepage builder.

Important current issue:
There are still old links pointing to the old /quote-wizard flow. The Services page, Dream Yard Recon page, Service Area page, HOA page, nav Plan Builder button, and other similar CTA buttons need to stop sending people to the old quote wizard and instead send them to the new homepage builder section.

Overall direction:
- Homepage should be a single-scroll, mobile-first marketing page
- Friendly military / neighborhood hero vibe
- Primary CTA = Talk to Lawn Trooper AI
- Secondary CTA = Build My Plan in 60 Seconds
- Keep the builder simple
- Keep pricing clear
- No walls of text
- Do not lead with credits
- Position plans as seasonal lawn care with monthly billing
- Best framing is a 90-day Yard Reset / one full season
- Mission Reports = before/after gallery with short stories
- CTA paths should go to phone, GHL, or the new homepage builder

Implement these exact changes:

1. Fix all old builder links
Update every button or link that still points to /quote-wizard or the old 4-step builder.
This includes at minimum:
- Services page CTA buttons
- Dream Yard Recon page CTA buttons
- Service Area page CTA buttons
- HOA page CTA buttons
- top nav Plan Builder button
- any other “Get Your Instant Quote” or similar CTA still using the old flow

All of those should instead:
- scroll to the new homepage builder section, or
- route to the homepage with an anchor link to the new builder section

Use one consistent builder anchor target site-wide.

2. Keep only the new builder as the primary customer-facing flow
The new homepage builder is the main flow.
Keep it to 3 steps only:
- Yard Size
- Patrol Level
- Seasonal Touches

Do not expose the old 4-step quote wizard as the primary experience anymore.

3. Update builder wording
Step 3 should no longer say “Quick Custom Touches.”
Rename it to something like:
- Seasonal Touches
or
- Custom Seasonal Touches

Use helper copy like:
“Select all that apply in your yard. We can bundle these across the season to match your goals.”

Do not force the user to pick a limited number.
This step is for preference collection and sales/account-manager follow-up, not strict self-service selection.

4. Improve Seasonal Touches options
Add or improve options such as:
- Mulch refresh
- Weed control
- Flower bed flowers / seasonal color
- Trash can cleaning
- Shrub trimming
- Leaf cleanup
- Aeration
- Flower bed weeding
- Seasonal flower pop
- Any other strong standard/premium seasonal touches already relevant in the repo

Use the best available images/icons for each option.
If the repo already contains usable image assets, use them.
If not, use visually consistent placeholders/icons that can be replaced later.

Important:
- Flowers should look like flowers
- Mulch should look like mulch / wheelbarrow / fresh bed work
- Weed control should visually read as weed control
- Trash can cleaning should be included
- These cards should feel more visual and useful than generic boxes

5. Improve yard size step layout
The yard size choices should be easier to scan.
Keep:
- Small = up to 1/3 acre
- Medium = 1/3 – 2/3 acre
- Large = 2/3 – 1 acre

Keep the helper copy for Small:
“Most homes · Not sure? Start here”

Keep the note:
“Not sure? Choose Small and we’ll confirm after photos or your walkthrough.”

If needed for mobile clarity, make the size buttons:
- equal width, or
- stacked more cleanly

6. Add a “What actually happens” section
Add a simple, visual section that explains the Yard Reset flow in plain English.

Suggested structure:
- Day 1: Dream Yard Recon
  Quick property walk + AI / AR plan sent to you
- Days 2–30: The Reset
  Catch-up trim, mow, edge, beds, cleanup, turf work
- Days 31–90: Dial it in
  Add seasonal touches, settle into service rhythm, improve curb appeal

Use short, readable copy.
This should help people understand what happens after signup.

7. Fix Mission Reports / before-and-after logic
The current before-and-after transformations should not use mismatched houses that look fake.
Refactor this section so it supports true matched pairs.

Rules:
- Do not present obviously mismatched before/after pairs as real transformations
- If no matching before image exists, use a neutral placeholder state or label it as sample content
- Build the section so it is easy to swap in real before/after pairs later
- Use short story/caption structure under each report

Also create a clear asset placeholder list for what still needs to be replaced with real images.

8. Prepare Mission Reports for better future visuals
Structure the Mission Reports section so that later it can accept:
- real before photo
- real after photo
- matching property story
- optional video clip

If there is a clean way to support future generative placeholder images, organize the component for that, but do not fake realism with obviously different homes.

9. Clarify the birthday bonus
The “birthday month” offer is confusing.
Rewrite it so it clearly refers to the intended meaning.
If this is meant to be a service anniversary / signup anniversary perk, say that clearly.
Avoid wording that makes it sound like the customer’s personal birthday unless that is truly the offer.

10. Keep pricing/plan language clear
Use simple customer-facing plan summaries:
- Standard Patrol — $169/mo — Bi-weekly mowing + 1 Seasonal Touch per season
- Premium Patrol — $299/mo — Weekly mowing + 2 Seasonal Touches per season
- Executive Command — $399/mo — Priority service + 3 Seasonal Touches per season

Keep one shared line:
“All new plans start with a Yard Reset boost in Month 1.”

Use seasonal framing such as:
- Built around a full 90-day season
- Billed monthly
- Included touches are scheduled across your active season

Avoid:
- year-long contract language in sales copy
- “cancel anytime” phrasing
- public-facing credit complexity

11. Keep the overall tone
- friendly military / neighborhood hero
- simple
- clear
- mobile-first
- high-converting
- trustworthy
- not too salesy
- not too legal

12. Test the site after implementation
After changes are made, test:
- every main nav button
- every major CTA on Services, Dream Yard Recon, Service Area, HOA, and homepage
- builder step transitions
- builder anchor links
- plan selection
- Seasonal Touches selection
- mobile layout
- footer links

When done, show me:
1. which files changed
2. which old links were fixed
3. the final homepage/builder section order
4. the exact updated copy for the “What actually happens” section
5. the exact updated copy for the birthday/anniversary offer
6. which placeholders still need real assets
7. any remaining issues or risks
```

## Prompt 2 — QA Pass

```text
QA pass.

Now test the updated site top to bottom and fix anything still broken or confusing.

Specifically verify:
- no important CTA still points to /quote-wizard
- all service-page and HOA-page builder buttons route to the new homepage builder
- Mission Reports no longer show obviously fake mismatched before/after content as if it is real
- Seasonal Touches is more visual and easier to understand
- the yard-size buttons are easy to scan on mobile
- the “What actually happens” section is clear
- the birthday/anniversary bonus wording is no longer confusing

Then give me:
1. final files changed
2. unresolved issues
3. exact placeholders I still need to replace
4. your top 5 next improvements ranked by conversion impact
```

## Suggested Replit Settings

- Start in **Plan Mode**
- Then switch to **Build Mode**
- Use **Power**
- Turn **App Testing ON**
- Turn **Code Optimizations ON**
- Leave **Turbo OFF** unless you specifically want faster/more expensive runs
