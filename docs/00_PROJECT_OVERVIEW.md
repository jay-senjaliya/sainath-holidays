# 00 — Project Overview

> **Status:** Living document — update whenever scope, naming, or strategy changes.
> **Last updated:** 2026-07-25

## What this is

**TravelERP** (working codename) is a multi-tenant SaaS platform that aims to become the complete **Business Operating System** for tour & travel agencies — replacing the Excel sheets, WhatsApp threads, paper diaries, and Word-doc quotations that most agencies run on today.

The codebase in this repository is the **first, real-world implementation** of that platform, currently running as a single-tenant deployment for **Sainath Holidays**, a real travel agency acting as the pilot/first client. This is a deliberate strategy, not an accident:

> Build real, production-grade workflows against one real business first. Prove them. Then generalize into a multi-tenant product other agencies can subscribe to.

Read that distinction carefully — it shapes everything else in this doc set:

| Layer | Name | What it is |
|---|---|---|
| **Platform** | TravelERP (codename, may be renamed) | The SaaS product being built to eventually sell to many travel agencies. Owns the Super Admin layer, billing, tenant management. |
| **Tenant #1** | Sainath Holidays | A real travel agency using the system today as its day-to-day business tool. Its actual operational needs drive near-term feature design. |

Do not read the current codebase as "the product." It is the foundation — see [01_VISION.md](./01_VISION.md) for why the target is far larger, and [03_ROADMAP.md](./03_ROADMAP.md) for how we get from here to there.

## The problem being solved

Most travel agencies — small and medium ones especially — run their entire operation across disconnected, manual tools:

- Excel / Google Sheets for bookings and payments
- WhatsApp for customer communication and internal coordination
- Paper diaries and notebooks for itineraries and schedules
- Word documents for quotations
- Phone calls with no recorded history

Nothing is connected. Nothing is searchable. Nothing scales past one or two people keeping it all in their heads.

## The target customer

| Now | Later |
|---|---|
| Small travel agencies | Large agencies |
| Medium travel agencies | Multi-branch agencies |
| | Destination Management Companies (DMCs) |
| | Tour operators |
| | Corporate travel companies |

## Current state (as of 2026-07-25)

The codebase implements roughly **10–15% of the final product scope** — a working foundation, not a finished ERP:

- Authentication (email/password, phone OTP, Google OAuth2)
- Tour Packages (public catalog + admin CMS)
- Hotels, Vehicles, Tickets (public catalogs + admin CRUD)
- Enquiries (a flat lead-capture form — the seed of the future CRM)
- Bookings (manual admin-entry booking records)
- Admin Dashboard (KPIs, recent activity, upcoming trips)
- Public marketing website

Stack: Spring Boot 3 (Java) backend, React + TypeScript + Vite frontend, PostgreSQL, Redis. See the codebase itself for exact versions and structure — this doc set does not duplicate what's derivable by reading the code.

None of the CRM, Sales/Quotation, Finance, Vendor Management, Operations, Marketing, Analytics, AI, or Enterprise (multi-tenant, RBAC, multi-branch) layers exist yet in real form. That is expected — see the roadmap.

## How to read this documentation set

This is a living, numbered documentation set. Numbers are stable identifiers — don't renumber existing docs when adding new ones; extend the range instead.

| Doc | Purpose |
|---|---|
| [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) | You are here — orientation and doc map |
| [01_VISION.md](./01_VISION.md) | The long-term mission, philosophy, and north star |
| [02_PRODUCT.md](./02_PRODUCT.md) | What the product is: customers, module catalog, packaging model |
| [03_ROADMAP.md](./03_ROADMAP.md) | Phased plan from current state to full vision |
| [04_USER_ROLES.md](./04_USER_ROLES.md) | Who uses the system, at both platform and tenant level |
| [05_BUSINESS_WORKFLOW.md](./05_BUSINESS_WORKFLOW.md) | The real operational workflow the software must support |
| [06_SYSTEM_ARCHITECTURE.md](./06_SYSTEM_ARCHITECTURE.md) | Target technical architecture: modules, data layer, auth/authz, integrations, scalability, multi-tenant readiness |
| `07`–`17` | *Reserved* for future detailed specs (data model, per-module specs, API standards) — not yet written |
| [18_CLAUDE.md](./18_CLAUDE.md) | Standing instructions for AI coding assistants working in this repo |

## Ownership & maintenance

This document set describes the **target end-state**, not just what's currently coded. When a major module ships (e.g. CRM, Quotation Engine), update the relevant docs rather than letting them drift out of sync with reality. Documentation debt compounds the same way technical debt does.
