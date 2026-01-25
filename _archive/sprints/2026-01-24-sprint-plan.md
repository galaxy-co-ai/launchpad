# Sprint Plan — Baseline Alignment + Security Hardening

**Status:** ACTIVE
**Window:** 2026-01-24 → 2026-02-07
**Owner:** Dalton + Launchpad Core Team

---

## Problem Statement

Launchpad has drift between the locked stack, templates, and the active Launchpad app. Security posture is also weakened by tokenized Git remotes and missing automated secret scanning. This creates onboarding friction, version ambiguity, and exposure risk.

---

## Goals

- Enforce a single canonical tech baseline across templates and live apps.
- Remove tokenized Git remotes and formalize secrets hygiene.
- Establish CI guardrails for secret scanning.
- Document the baseline and the security policy in permanent stack docs.

---

## Non-Goals

- No new feature development for Launchpad app UI.
- No changes to product scope or SOP content.
- No infrastructure migrations beyond credential hygiene.

---

## Success Criteria

- Templates and `projects/launchpad-app` use the canonical Next.js + React baseline.
- No embedded tokens remain in Git remotes.
- CI runs a secret scanner and blocks leaking PRs.
- TECH_BASELINE and SECURITY_BASELINE docs are the source of truth.

---

## Architecture Overview (One-Page Diagram)

```
                 ┌─────────────────────┐
                 │  _stack (LOCKED)    │
                 │  Stack + Baselines  │
                 └─────────┬───────────┘
                           │
                           ▼
┌─────────────────┐   ┌───────────────┐   ┌─────────────────────┐
│ _templates/     │──►│ New Projects  │──►│ Hosting + Services   │
│ nextjs-web      │   │ (Next.js)     │   │ Vercel, Neon, etc.   │
└──────┬──────────┘   └───────────────┘   └─────────────────────┘
       │
       │
       ▼
┌─────────────────────┐   ┌────────────────────────┐
│ projects/launchpad  │──►│ Tauri (Rust) Backend    │
│ (Next.js Frontend)  │   │ Desktop Shell           │
└─────────┬───────────┘   └────────────────────────┘
          │
          ▼
┌─────────────────────────────┐
│ Automation & Tooling         │
│ MCP Server + n8n Workflows   │
└─────────────────────────────┘
```

---

## Scope and Work Plan

### Phase A — Baseline Alignment

- Update `projects/launchpad-app` to match locked stack (Next.js 15.x, React 19.x).
- Align `_templates/project/nextjs-web` to the same baseline.
- Confirm TypeScript, ESLint, and Tailwind versions match `_stack/dependencies.md`.
- Record any breaking changes and mitigation steps.

### Phase B — Security Hardening

- Replace tokenized Git remotes with SSH or CI secrets.
- Add secret scanning to CI (gitleaks or equivalent).
- Document incident response and developer checklist.
- Audit repo for accidental secrets and remove them.

---

## Deliverables

- `_stack/TECH_BASELINE.md`
- `_stack/SECURITY_BASELINE.md`
- Updated `projects/launchpad-app/package.json` to match locked stack
- Updated `_templates/project/nextjs-web/package.json` to match locked stack
- CI secret scanning step in `.github/workflows/ci.yml`
- MANIFEST update documenting the migration

---

## Risks and Mitigations

- **Risk:** Downgrading Next.js could break app features.
  - **Mitigation:** Stage the downgrade, run tests, and validate Tauri builds.
- **Risk:** Secret scanning produces false positives.
  - **Mitigation:** Use allowlist only when justified, review flagged items quickly.
- **Risk:** CI changes slow the pipeline.
  - **Mitigation:** Run secret scans in parallel with existing lint/type-check.

---

## Milestones

1. Baseline docs merged and MANIFEST updated.
2. Launchpad app aligned to locked stack.
3. Templates aligned and validated.
4. CI secret scanning enabled.
5. Security incident checklist documented.

---

## Definition of Done

- All baseline docs are in place and referenced by the stack.
- No version drift remains between templates and launchpad-app.
- Secret scanning blocks leaks in CI.
- Remote URLs contain no embedded credentials.

