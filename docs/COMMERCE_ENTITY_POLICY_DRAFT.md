# YatraBeyond — Commerce & Entity Policy (Working Draft)

Date: 5 July 2026

**This is not legal or tax advice, and I'm not a lawyer or accountant.** It records a working default so the `/travel` module (approved for Phase 1) has a documented starting position, and flags exactly where a real accountant or lawyer should be brought in before it matters. Confirm all of this with a professional once there's real transaction volume, and definitely before it's relied on for an actual GST or tax filing.

---

## 1. Working default (documented 5 Jul 2026, per Vivek)

- YatraBeyond operates as a **New Zealand entity** for all commercial purposes, since Vivek is NZ-based.
- **No active vendors or customers exist yet.** No entity registration or GST action is being taken right now, this is a documented default position, not a completed legal step.
- When a counterparty exists (customer or vendor), classify them by residency: **NZ-based** or **foreign/international**, and apply standard treatment for that classification (below), reviewed properly once volume is real.
- Keep it "least needed, clearly required" for now: don't set up structure the current requirements don't call for, but don't operate loosely either, document the default and follow it consistently once something does transact.

## 2. What "standard treatment" means, in general terms (verify before relying on this)

- **GST registration threshold in New Zealand is NZD $60,000 of turnover in a rolling 12-month period.** Below that, GST registration is optional; once turnover meets or is expected to meet that threshold, registration is generally required. (Source: NZ Inland Revenue, current as of this search.)
- Once registered, the general pattern is: GST (currently 15%) applies to sales to **NZ-resident customers** of NZ-supplied goods/services; sales of services to **genuinely overseas consumers** are commonly zero-rated as an export of services, but the exact treatment depends on the nature of what's being sold (digital content vs a physical good vs a travel-booking commission) and needs confirming for this specific business, not assumed from a general rule.
- **Foreign vendors/partners** (e.g. an Indian tour operator paying YatraBeyond a commission) raise their own questions, cross-border withholding tax, the paying entity's own local tax obligations, and what the partner agreement says about who's responsible for what. Standard commission/affiliate agreement terms (disclosure, no liability for the underlying service, clear commission %) are a reasonable starting point for the agreement itself, the tax treatment still needs a professional's confirmation.
- None of the above is final. It's what the general public rules say; whether they apply exactly this way to YatraBeyond's specific setup is exactly the kind of question to bring to an accountant, ideally before the first real transaction, not after.

## 3. Trigger to get professional advice (don't wait for the GST threshold itself)

Revisit this properly, with an accountant and/or lawyer, at whichever comes first:

- The `/travel` module has its first real, paying transaction or commission payout.
- Turnover is approaching the NZD $60,000 GST threshold, or looks likely to within 12 months.
- A partner agreement (tour operator, temple trust, sponsor) is actually being signed, not just discussed.

## 4. What this unblocks for Phase 1

The `/travel` module can be built and shipped in Phase 1 as planned (per the commerce-timing decision in `PHASE1_FINAL_BUILD_BRIEF.md`), with: an affiliate-disclosure component on every commercial link (already required regardless of entity questions), and copy that doesn't overstate YatraBeyond's role (directory/referrer, not the service provider, per Fable's original recommendation). Nothing about entity or tax status blocks writing that code, it only matters once money actually starts moving, which is exactly when section 3 above says to get real advice.

---
Sources checked for the general NZ GST figures above: [IRD — Supplying remote services into New Zealand](https://www.ird.govt.nz/gst/gst-for-overseas-businesses/supplying-remote-services-into-new-zealand)
