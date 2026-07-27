# 02 — Product

> **Status:** Living document
> **Last updated:** 2026-07-25

This document defines what TravelERP *is* as a product: who it's for, what it's made of, and how it's packaged. For the "why," see [01_VISION.md](./01_VISION.md). For "when," see [03_ROADMAP.md](./03_ROADMAP.md).

## Product summary

TravelERP is a multi-tenant SaaS Business Operating System for tour & travel agencies. Each subscribing agency is a **tenant**, isolated from every other tenant's data, running the full suite of modules described below inside their own branded Admin Panel and public-facing website.

## Target customers

| Horizon | Segment | Why they matter |
|---|---|---|
| **Now** | Small travel agencies | Highest pain-to-tool-cost ratio; currently 100% manual (Excel/WhatsApp/paper) |
| **Now** | Medium travel agencies | Have outgrown spreadsheets but can't justify enterprise ERP pricing |
| **Later** | Large agencies | Need deeper reporting, staff hierarchy, and vendor management at scale |
| **Later** | Multi-branch agencies | Need branch-level data isolation with company-level roll-up reporting |
| **Later** | Destination Management Companies (DMCs) | Vendor-heavy operations (local ground handlers, guides, contracts) |
| **Later** | Tour operators | Package-heavy, groups/batches, seat inventory management |
| **Later** | Corporate travel companies | Approval workflows, expense policies, invoicing to companies not individuals |

## Core value proposition

For every segment, the pitch is the same shape: **"Stop running your agency across five disconnected tools. Run it from one system that remembers everything and does the busywork for you."**

## Module catalog

This is the full catalog of modules the product will eventually contain. Each will get its own detailed spec doc as it's built (reserved in the `06`–`17` doc range). Existing implementation is marked; everything else is planned.

### Foundation *(exists today, see [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md))*
Authentication, Tour Packages, Hotels, Vehicles, Tickets, Enquiries, Bookings, Admin Dashboard, Public Website.

### CRM
Customer management, lead management, lead pipeline, customer timeline, followups, activities, notes, tasks, communication history. **This is the natural next module** — it directly upgrades the existing flat Enquiries feature into a real pipeline.

### Sales
Quotation builder, quotation templates, quotation PDF export, price calculator, discount rules, approval workflow, sales pipeline, lead-to-booking conversion tracking.

### Booking
Package booking, hotel booking, vehicle booking, flight booking, ticket booking, visa, insurance, activities — complete tour management, building on the existing Bookings foundation.

### Finance
Payment tracking, installments, receipts, invoices, vendor payments, expense tracking, profit calculation, commission tracking, GST, accounting integration, cash flow.

### Vendor Management
Hotels, drivers, vehicle owners, guides, agents, suppliers, contracts, season pricing, vendor ratings — the supply side of the business, distinct from the customer-facing Hotel/Vehicle catalogs that already exist.

### Operations
Task assignment, tour operations, travel calendar, booking calendar, vehicle calendar, hotel availability, staff workflows.

### Marketing
WhatsApp integration, email campaigns, coupons, loyalty program, referral program, customer reviews, Google review requests.

### Analytics
Revenue, profit, lead conversion, best destination, best salesperson, repeat customers, customer lifetime value, expense analysis, vendor performance, business dashboard.

### AI
AI quotation generator, AI itinerary generator, AI WhatsApp reply assistant, AI email writer, AI analytics assistant, AI sales insights, AI customer recommendations, AI lead scoring.

### Enterprise
Role-based access control, multi-company, multi-branch, audit logs, workflow engine, notification center, public API, mobile apps, customer portal, employee portal.

## Packaging & multi-tenancy model

The product-level shape of multi-tenancy (the engineering approach is an architecture decision for a future doc, not this one):

- **Tenant = one travel agency.** Each tenant gets an isolated data set, their own Admin Panel, and their own branded public website (custom domain support is a later enterprise capability).
- **Platform layer (TravelERP).** Above all tenants sits a platform/super-admin layer operated by the company selling TravelERP — manages tenant provisioning, subscription/billing status, and platform-wide health. This layer does not exist yet in the current codebase (see [03_ROADMAP.md](./03_ROADMAP.md)).
- **Tenant #1: Sainath Holidays.** Today, the codebase runs as if there were only one tenant, because there is only one — a real agency, not a demo. See [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) for why this sequencing was chosen deliberately.
- **Pricing/subscription tiers** are not yet defined. This should be revisited once enough modules exist to package into meaningful tiers (e.g. Starter / Growth / Enterprise) — do not invent tier pricing prematurely.

## Explicitly out of scope (for now)

- Anything requiring a dedicated mobile app codebase (native iOS/Android) — Enterprise-phase only.
- Multi-currency / multi-country tax compliance beyond India-first GST — revisit once there's demand from a non-Indian tenant.
- White-labeling / custom domains per tenant — Enterprise-phase capability, not needed while there is one tenant.
