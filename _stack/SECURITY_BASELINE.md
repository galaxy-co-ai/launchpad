# Launchpad Security Baseline

> Security rules for credentials, remotes, and CI hygiene.

**Status:** ACTIVE
**Last Updated:** 2026-01-24
**Owner:** Dalton @ GalaxyCo.ai

---

## Purpose

This baseline defines the minimum security posture for all Launchpad repositories and projects. It focuses on:
- Credential handling
- Git remote hygiene
- Secret scanning in CI
- Incident response

---

## Core Principles

- No secrets in the repo, ever.
- Least privilege for all credentials and service accounts.
- Rotate credentials immediately if exposure is suspected.
- Security decisions are documented and enforceable.

---

## Git Remote Policy

- Use SSH remotes by default (`git@github.com:org/repo.git`).
- Never embed PATs or tokens in remote URLs.
- CI must use GitHub-provided `GITHUB_TOKEN` or repo secrets only.
- If a token is ever exposed, rotate it immediately and replace the remote.

---

## Secrets Handling

- Templates must only include placeholders in `.env.example` and `.env.local.template`.
- Production secrets live in Vercel, GitHub Secrets, or the service provider vault.
- Never log secrets, API keys, or tokens in CI output.
- New env vars must be documented in the env template and MANIFEST as needed.

---

## Secret Scanning (CI)

Baseline recommendation:
- Add a secret-scanning step to CI (gitleaks or equivalent).
- Block merges when a potential secret is detected.
- Maintain an allowlist for false positives only when justified.

---

## Incident Response

If a secret is exposed:
1. Revoke or rotate the credential immediately.
2. Remove the secret from the repo and all history if needed.
3. Document the incident in `_archive/audits/`.
4. Add a guardrail to prevent recurrence (scan rule, lint, or pre-commit).

---

## Developer Checklist

Before every commit:
- Confirm no tokens or credentials appear in file diffs or logs.
- Ensure `.env` files are ignored and templates contain placeholders only.
- Avoid copy-pasting secrets into markdown or comments.

---

*This baseline is mandatory for all Launchpad work.*
