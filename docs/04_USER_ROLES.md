# 04 — User Roles

> **Status:** Living document
> **Last updated:** 2026-07-25

Roles exist at three layers, matching the Platform vs. Tenant split in [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md). This doc defines roles conceptually, at product level — the actual RBAC engineering spec (permissions table, enforcement mechanism) belongs in a future `06`–`17` doc once the module set exists to make it concrete.

## Layer 1 — Platform (TravelERP)

Roles belonging to the company operating TravelERP itself, not to any individual agency.

| Role | Purpose |
|---|---|
| **Platform Super Admin** | Provisions and manages tenants, monitors platform health, handles billing/subscriptions across all agencies. Does not appear until the [Multi-Tenancy Retrofit phase](./03_ROADMAP.md#phase-6--multi-tenancy-retrofit). |
| **Platform Support** *(future)* | Read-access support role for troubleshooting a tenant's issue without full super-admin power. |

## Layer 2 — Tenant (an agency, e.g. Sainath Holidays)

Roles belonging to one subscribing agency, scoped entirely to that agency's own data.

| Role | Purpose | Current implementation |
|---|---|---|
| **Agency Owner / Admin** | Full access within their tenant: all modules, staff management, settings. | Maps to today's `ADMIN` role |
| **Sales Manager** *(future)* | Oversees the sales pipeline, approves discounts, reassigns leads | Not implemented |
| **Sales Executive / Agent** *(future)* | Owns assigned leads, builds quotations, tracks their own bookings | Not implemented |
| **Operations Staff** *(future)* | Manages vendor coordination, task execution, tour-day logistics | Not implemented |
| **Accountant / Finance** *(future)* | Payments, invoices, expenses, vendor payments, profit reporting | Not implemented |
| **Customer Support** *(future)* | Handles post-booking queries and feedback, no financial access | Not implemented |
| **Branch Manager** *(future, Enterprise phase)* | Owner-level access scoped to one branch of a multi-branch agency | Not implemented |

## Layer 3 — External participants

| Role | Purpose | Current implementation |
|---|---|---|
| **Customer / Traveler** | Browses the public site, submits enquiries, and (future) tracks their own bookings via a Customer Portal | Maps to today's `USER` role |
| **Guest / anonymous visitor** | Browses public packages/hotels/vehicles/tickets without an account | Fully supported today (public endpoints) |
| **Vendor / Supplier user** *(future)* | A hotel partner, vehicle owner, or guide with limited portal access to their own bookings/availability/payments | Not implemented — part of the future Vendor Portal (Enterprise phase) |

## Conceptual permission matrix

High-level module access by tenant-layer role. `✓` = full access, `~` = partial/scoped access, blank = no access. This is illustrative, not an enforcement spec.

| Module | Owner/Admin | Sales Mgr | Sales Exec | Operations | Finance | Support |
|---|---|---|---|---|---|---|
| CRM / Leads | ✓ | ✓ | ~ (own leads) | | | ~ (read-only) |
| Sales / Quotations | ✓ | ✓ | ~ (own quotes) | | | |
| Bookings | ✓ | ✓ | ~ (own) | ~ (read) | ~ (read) | ~ (read) |
| Finance | ✓ | | | | ✓ | |
| Vendor Management | ✓ | | | ✓ | ~ (read) | |
| Operations | ✓ | | | ✓ | | |
| Analytics | ✓ | ~ (sales metrics) | | ~ (ops metrics) | ~ (financial metrics) | |
| Settings / Staff Management | ✓ | | | | | |

## Gap between current and target state

Today the system has exactly two roles — `USER` and `ADMIN` — enforced via `@PreAuthorize("hasRole('ADMIN')")` and URL rules in `SecurityConfig`. Everything in Layer 2's tenant roles beyond Owner/Admin is a gap to be closed starting in the [CRM Core phase](./03_ROADMAP.md#phase-1--crm-core--lead-pipeline), when leads first need to be *assigned* to someone other than "the admin."
