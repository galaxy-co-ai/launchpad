# n8n Workflow Templates

> Reusable automation workflows for Launchpad projects.

## Overview

These n8n workflow templates automate common tasks in the Micro-SaaS shipping pipeline:

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| `health-monitor.json` | Daily health dashboard | Scheduled (daily 9am) |
| `idea-intake-notify.json` | Idea validation alerts | Webhook |
| `deploy-alert.json` | Deployment notifications | Vercel webhook |

---

## Prerequisites

1. **n8n instance** - Local or cloud (self-hosted recommended per STACK.md)
2. **Notification destination** - Slack or Discord webhook URL
3. **Service credentials** - API keys for services you want to monitor

---

## Quick Start

### 1. Import a Workflow

1. Open your n8n instance
2. Click **Workflows** → **Add Workflow** → **Import from File**
3. Select the `.json` file you want to import
4. Configure credentials (see below)
5. Activate the workflow

### 2. Configure Credentials

Each workflow uses n8n credentials. Create these in **Settings** → **Credentials**:

| Credential Type | Used By | Required Fields |
|-----------------|---------|-----------------|
| Slack API | All workflows | Webhook URL |
| Discord Webhook | All workflows (alt) | Webhook URL |
| HTTP Header Auth | health-monitor | Sentry token, Stripe key |
| PostgreSQL | health-monitor | Neon connection string |
| HTTP Header Auth | deploy-alert | Vercel token |

---

## Workflow Details

### health-monitor.json

**Purpose:** Daily health digest aggregating data from all services.

**Trigger:** Cron schedule (default: 9:00 AM daily)

**Data Sources:**
- Sentry: Error count and top issues (last 24h)
- Stripe: Revenue (daily total, MRR)
- Vercel: Latest deployment status
- Neon: Database connection health

**Output:** Formatted message to Slack/Discord with:
- Error summary with links to Sentry
- Revenue metrics
- Deployment status (success/failure)
- Database health (connected/disconnected)

**Environment Variables:**
```
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-token
STRIPE_SECRET_KEY=sk_live_xxx
VERCEL_TOKEN=your-token
VERCEL_PROJECT_ID=your-project-id
NEON_DATABASE_URL=postgres://...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

---

### idea-intake-notify.json

**Purpose:** Alert when ideas are validated through the audit process.

**Trigger:** Webhook POST to `/webhook/idea-intake`

**Expected Payload:**
```json
{
  "slug": "quickclaims-ai",
  "name": "QuickClaims AI",
  "score": 385,
  "outcome": "proceed",
  "auditor": "Claude",
  "timestamp": "2025-01-05T10:30:00Z"
}
```

**Logic:**
- Score > 350 → Green notification (Proceed)
- Score 250-350 → Yellow notification (Pivot Required)
- Score < 250 → Red notification (Killed)

**Output:** Color-coded Slack/Discord message with:
- Idea name and slug
- Final score (out of 500)
- Outcome recommendation
- Link to audit report in `_vault/audits/`

**Environment Variables:**
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
AUDIT_REPORTS_BASE_URL=https://github.com/your-org/launchpad/blob/main/_vault/audits
```

---

### deploy-alert.json

**Purpose:** Real-time notifications when Vercel deployments complete.

**Trigger:** Vercel webhook to `/webhook/deploy`

**Setup:**
1. Go to Vercel Dashboard → Project → Settings → Git → Deploy Hooks
2. Or use Vercel Integrations → Webhooks
3. Point to your n8n webhook URL

**Expected Payload:** Vercel deployment webhook format (auto-parsed)

**Output:** Slack/Discord message with:
- Project name
- Deployment status (success/failure/cancelled)
- Git branch and commit message
- Live URL (if successful)
- Error details (if failed)

**Environment Variables:**
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

---

## Customization

### Changing Notification Destination

All workflows use a "Send Notification" node at the end. To switch from Slack to Discord:

1. Delete the Slack node
2. Add a Discord Webhook node
3. Connect to the previous node
4. Configure with your Discord webhook URL

### Adjusting Schedule

For `health-monitor.json`:

1. Open the workflow
2. Click the Cron trigger node
3. Modify the schedule expression (e.g., `0 9 * * *` for 9am daily)

### Adding Services

To monitor additional services in `health-monitor.json`:

1. Add an HTTP Request node
2. Configure the API endpoint and auth
3. Connect to the Merge node before formatting
4. Update the Format Report node to include new data

---

## Troubleshooting

### Workflow Not Triggering

- **Scheduled:** Check that the workflow is active (toggle in top-right)
- **Webhook:** Verify the webhook URL is correct and accessible
- **Credentials:** Ensure all credentials are valid and not expired

### Missing Data in Reports

- Check API rate limits (especially Stripe, Sentry)
- Verify credential permissions include required scopes
- Check n8n execution logs for errors

### Notifications Not Sending

- Test webhook URL with curl: `curl -X POST -d '{"text":"test"}' YOUR_WEBHOOK_URL`
- Check Slack/Discord webhook is not expired
- Verify n8n has outbound internet access

---

## Related

- `_sops/11-post-launch-monitoring.md` - What to monitor
- `_integrations/INTEGRATIONS.md` - Service setup guides
- `_stack/STACK.md` - Locked tech decisions (n8n self-hosted)
