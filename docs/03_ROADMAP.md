# 03 — Roadmap

> **Status:** Living document
> **Last updated:** 2026-07-25

Phases, not dates. No calendar commitments are made here since this is developed by a small team against real client (Sainath Holidays) needs — sequencing matters far more than deadlines. Reorder phases as real priorities shift, but update this doc when you do.

## Phase 0 — Foundation *(current)*

Status: **done / in production use**

Auth, Tour Packages, Hotels, Vehicles, Tickets, Enquiries, Bookings, Admin Dashboard, Public Website — running single-tenant for Sainath Holidays. See [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md).

## Phase 1 — CRM Core / Lead Pipeline

Status: **next up**

Upgrade the existing flat `Enquiry` feature into a real CRM foundation:
- Lead pipeline stages (New → Contacted → Qualified → Quoted → Won/Lost)
- Lead assignment to a salesperson
- Customer timeline (every interaction against a customer, in one place)
- Followups, activities, notes, tasks tied to a lead/customer

**Why first:** every other module (Sales, Finance, Operations) hangs off a lead or customer record. Getting this data model right early avoids painful migrations later.

## Phase 2 — Sales / Quotation Engine

- Quotation builder (line items: package, hotel, vehicle, tickets, add-ons)
- Quotation templates and branded PDF export
- Price calculator, discount rules, approval workflow for discounts
- Lead → Quotation → Booking conversion tracking, feeding Analytics later

**Why now:** this is the single biggest manual-effort pain point today (hand-typed Word quotations) and the most visible win for Sainath Holidays' day-to-day work.

## Phase 3 — Finance Core

- Payment tracking against a Booking (advance, installments, balance)
- Receipts and customer-facing invoices
- Basic profit calculation per booking (revenue − vendor cost)

**Why now:** once Sales produces real quotations and bookings, money needs to be tracked against them properly instead of the current `advancePaid`/`totalAmount` flat fields.

## Phase 4 — Operations

- Task assignment (who does what, by when, for which booking)
- Vehicle / hotel / tour calendars
- Staff workflow views (what's on my plate today)

**Why now:** by this point there's enough booking volume that manual coordination (phone calls, WhatsApp) becomes the bottleneck.

## Phase 5 — Vendor Management

- Vendor records for drivers, vehicle owners, guides, agents, suppliers — distinct from the customer-facing Hotel/Vehicle catalogs
- Contracts, season pricing, vendor ratings
- Feeds directly into Finance (vendor payments) and Operations (vendor coordination)

## Phase 6 — Multi-Tenancy Retrofit

Status: **the point where TravelERP becomes actually sellable to other agencies**

- Introduce tenant isolation into the data model (every existing table gains a tenant boundary)
- Build the Platform / Super Admin layer: tenant provisioning, subscription status, platform health
- Migrate Sainath Holidays' existing data into "tenant #1" of the new model
- Define subscription tiers and billing (see [02_PRODUCT.md](./02_PRODUCT.md))

> **Architectural note — sequencing decision, open for challenge:** Multi-tenancy is deliberately placed *after* Phases 1–5, not before. Retrofitting tenant isolation onto a schema is a well-understood, mechanical migration; getting the CRM → Sales → Finance → Operations workflows *correct* against a real business is the hard, valuable part. Building multi-tenant infrastructure before those workflows are proven risks over-engineering for hypothetical tenants while under-serving the one real customer. If you'd rather de-risk multi-tenancy earlier (e.g. because a second real customer is already lined up), that's a reasonable call to make differently — flag it and we'll re-sequence.

## Phase 7 — Marketing & Analytics

- WhatsApp Business integration, email campaigns, coupons, loyalty/referral programs, review requests
- Business analytics: revenue, profit, conversion, best destination/salesperson, CLV, vendor performance

## Phase 8 — AI Layer

- AI quotation and itinerary generation
- AI-assisted WhatsApp/email replies
- AI lead scoring and sales insights

**Why this late:** AI features are most valuable once there's real structured data (leads, quotations, bookings history) to ground them in. Building AI generation on top of Phase 0-era data would produce shallow results.

## Phase 9 — Enterprise

- RBAC hardening, multi-company/multi-branch support, audit logs
- Workflow engine, notification center
- Public API, mobile apps, customer portal, employee portal

## Cross-cutting, ongoing (not a phase)

- Documentation stays current with each shipped module (this doc set)
- Every module ships at the production-quality bar in [01_VISION.md](./01_VISION.md) — no phase gets a "we'll clean it up later" pass
