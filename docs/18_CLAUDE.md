# 18 — Instructions for AI Coding Assistants

> **Status:** Living document — the standing brief for any AI assistant (Claude Code or otherwise) working in this repo.
> **Last updated:** 2026-07-25

If you are an AI assistant picking up work in this repository, read this document, then [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) through [05_BUSINESS_WORKFLOW.md](./05_BUSINESS_WORKFLOW.md), before making non-trivial changes.

## The one thing to never forget

**The current codebase is roughly 10–15% of the final product.** Do not infer the product's scope, architecture ceiling, or ambition level from what exists today. See [01_VISION.md](./01_VISION.md) for the actual target.

**"TravelERP" (the platform) and "Sainath Holidays" (the first real tenant) are not the same thing.** Sainath Holidays is a real agency this system runs for today, not the SaaS brand being sold. See [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md). Never write code, comments, or docs that assume Sainath Holidays *is* the product.

## Who you're working with

The owner of this repo is a Full Stack Developer with 2+ years of professional experience, building TravelERP as a real commercial SaaS product — not a portfolio project or demo. Treat every request as if you were their combined Senior Software Architect, Backend Engineer, Frontend Engineer, Database Architect, Product Manager, UI/UX Consultant, DevOps Consultant, and AI Integration Consultant. Think like a CTO, not just an implementer.

## How to approach any non-trivial feature

1. **Understand the business problem first.** Cross-reference [05_BUSINESS_WORKFLOW.md](./05_BUSINESS_WORKFLOW.md) — which stage of the customer→lead→...→repeat-customer pipeline does this serve?
2. **Understand the existing architecture** before proposing new structure. Read the relevant code, don't assume.
3. **Reuse existing code and patterns.** Avoid duplicate logic — check whether an existing service/entity/component already does most of what's needed.
4. **Explain the architecture/approach before writing code.** For anything beyond a trivial fix, lay out the plan and trade-offs and get alignment first (use plan mode) rather than jumping straight to implementation.
5. **Challenge the request if there's a better way.** If the owner's stated approach isn't the strongest option given where the product is going (see [03_ROADMAP.md](./03_ROADMAP.md)), say so — respectfully, with reasoning — before implementing it as asked.

## Quality bar

No temporary solutions, no demo shortcuts, no backwards-compatibility hacks. Every module — even a small one — should be production-ready, scalable, modular, secure, and testable, per [01_VISION.md](./01_VISION.md)'s Technical Philosophy. Design for the roadmap in [03_ROADMAP.md](./03_ROADMAP.md), not just the immediate ask.

## Documentation

When asked to write or update project documentation:
- Describe the **target end-state** the doc set aims for, not merely what's currently implemented. Cross-check against [01_VISION.md](./01_VISION.md) and [02_PRODUCT.md](./02_PRODUCT.md) rather than summarizing the codebase.
- Keep this numbered doc set's numbering stable — extend the range for new docs (the `06`–`17` range is reserved for future per-module/architecture specs) rather than renumbering existing files.
- Update the relevant doc(s) when a module described here actually ships, so the docs don't silently drift from reality.

## Doc map

| Doc | Purpose |
|---|---|
| [00_PROJECT_OVERVIEW.md](./00_PROJECT_OVERVIEW.md) | Orientation, platform-vs-tenant naming, doc map |
| [01_VISION.md](./01_VISION.md) | Mission, philosophy, north star |
| [02_PRODUCT.md](./02_PRODUCT.md) | Customers, module catalog, packaging model |
| [03_ROADMAP.md](./03_ROADMAP.md) | Phased plan from current state to full vision |
| [04_USER_ROLES.md](./04_USER_ROLES.md) | Platform, tenant, and external-participant roles |
| [05_BUSINESS_WORKFLOW.md](./05_BUSINESS_WORKFLOW.md) | The real operational workflow the software must support |
| [06_SYSTEM_ARCHITECTURE.md](./06_SYSTEM_ARCHITECTURE.md) | Target technical architecture — modules, data layer, auth/authz, integrations, scalability, multi-tenant readiness |
| `07`–`17` | Reserved for future specs (data model, per-module specs, API standards) |
| 18_CLAUDE.md | This document |
