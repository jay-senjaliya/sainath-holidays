# 05 — Business Workflow

> **Status:** Living document
> **Last updated:** 2026-07-25

This document describes the real, end-to-end operational workflow a travel agency (starting with Sainath Holidays — see [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md)) runs today, and how each stage should be owned by a TravelERP module. It is the operational grounding for the pipeline introduced in [01_VISION.md](./01_VISION.md):

`Customer → Lead → Quotation → Booking → Hotel/Vehicle/Tickets → Payments → Operations → Tour → Feedback → Repeat Customer`

For each stage: the business goal, today's manual pain point, the owning module, and the primary role involved (see [04_USER_ROLES.md](./04_USER_ROLES.md)).

## 1. Lead Capture

**Goal:** Never lose a potential customer's first contact.

**Today (manual):** A phone call, WhatsApp message, or website enquiry comes in. It's written on paper, saved as a WhatsApp chat, or — best case — dropped into a shared Excel row. Leads from phone calls are the most likely to be lost entirely.

**Owning module:** CRM (currently: flat Enquiry form) · **Role:** Sales Executive / whoever answers first

## 2. Lead Qualification & Assignment

**Goal:** Know who owns following up on this lead, and how serious it is.

**Today (manual):** Whoever picked up the phone/WhatsApp owns it informally. No pipeline stage, no visibility for the owner into how many leads are open, stalled, or unattended.

**Owning module:** CRM — Lead Pipeline ([Phase 1](./03_ROADMAP.md#phase-1--crm-core--lead-pipeline)) · **Role:** Sales Manager assigns; Sales Executive owns

## 3. Requirement Gathering

**Goal:** Capture what the customer actually wants — destination, dates, group size, budget, preferences — once, correctly.

**Today (manual):** Re-asked over multiple WhatsApp/phone exchanges, often re-typed by hand into a Word doc when it's time to quote.

**Owning module:** CRM (activities/notes on the lead) · **Role:** Sales Executive

## 4. Quotation Creation

**Goal:** Turn a requirement into a priced, professional proposal fast.

**Today (manual):** Hand-typed in Word, prices calculated manually or in a side spreadsheet, easy to make pricing mistakes, no record of what was quoted if the customer negotiates later.

**Owning module:** Sales — Quotation Builder ([Phase 2](./03_ROADMAP.md#phase-2--sales--quotation-engine)) · **Role:** Sales Executive; Sales Manager for discount approval

## 5. Negotiation & Follow-up

**Goal:** Don't let a warm lead go cold from lack of follow-up.

**Today (manual):** Follow-ups tracked (if at all) as a mental note or a WhatsApp "seen" with no reply. No system reminds anyone to chase a quote that's gone quiet.

**Owning module:** CRM — Followups/Tasks ([Phase 1](./03_ROADMAP.md#phase-1--crm-core--lead-pipeline)) · **Role:** Sales Executive

## 6. Booking Confirmation

**Goal:** Convert an agreed quotation into a firm, trackable booking.

**Today (partial):** Bookings exist today but are entered manually by an admin with no direct link back to the quotation or lead that produced them.

**Owning module:** Booking (exists; conversion tracking added in [Phase 2](./03_ROADMAP.md#phase-2--sales--quotation-engine)) · **Role:** Sales Executive / Admin

## 7. Vendor Coordination (Hotel / Vehicle / Tickets)

**Goal:** Lock in the actual hotel rooms, vehicle, and tickets the booking depends on.

**Today (manual):** Phone calls to hotels and drivers, confirmed verbally, tracked nowhere durable except maybe a WhatsApp thread with the vendor.

**Owning module:** Vendor Management ([Phase 5](./03_ROADMAP.md#phase-5--vendor-management)), integrating with the existing Hotel/Vehicle catalogs · **Role:** Operations Staff

## 8. Payment Collection

**Goal:** Track advance, installments, and balance per booking without a side ledger.

**Today (partial):** Bookings today have flat `totalAmount`/`advancePaid` fields — a real ledger of installments, receipts, and due dates doesn't exist yet.

**Owning module:** Finance ([Phase 3](./03_ROADMAP.md#phase-3--finance-core)) · **Role:** Accountant / Finance

## 9. Pre-Tour Operations

**Goal:** Finalize itinerary details, collect documents, brief the customer and the ground team before departure.

**Today (manual):** Checklist (if it exists) lives in someone's head or a paper diary. Easy to miss a document or briefing step under time pressure.

**Owning module:** Operations — Task Assignment, Tour Calendar ([Phase 4](./03_ROADMAP.md#phase-4--operations)) · **Role:** Operations Staff

## 10. Tour Execution

**Goal:** Support the customer and coordinate vendors while the tour is actually happening.

**Today (manual):** Entirely phone/WhatsApp-driven, reactive rather than tracked.

**Owning module:** Operations · **Role:** Operations Staff

## 11. Post-Tour Feedback

**Goal:** Capture how the tour actually went, while it's fresh.

**Today (manual):** Rarely captured systematically — maybe an informal WhatsApp message asking "how was it?"

**Owning module:** Marketing — Reviews/Feedback ([Phase 7](./03_ROADMAP.md#phase-7--marketing--analytics)) · **Role:** Customer Support / Marketing

## 12. Repeat Customer / Referral

**Goal:** Turn a satisfied customer into a repeat booking or referral, deliberately rather than by chance.

**Today (manual):** Entirely dependent on the customer remembering the agency and reaching out again — no proactive loyalty or re-engagement.

**Owning module:** Marketing — Loyalty/Referral Program ([Phase 7](./03_ROADMAP.md#phase-7--marketing--analytics)); feeds back into stage 1 (Lead Capture) as a warm lead, not a cold one.

---

## Why this document matters

Every module in [02_PRODUCT.md](./02_PRODUCT.md) exists because it owns one or more of the twelve stages above. When evaluating whether a proposed feature belongs in the product, the test is: **which stage of this workflow does it make faster or more reliable?** If the answer isn't clear, the feature needs more justification before it's built — see the Product Philosophy in [01_VISION.md](./01_VISION.md).
