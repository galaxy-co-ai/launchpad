use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// Slugify a string for use in file names
fn slugify(name: &str) -> String {
    name.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect::<String>()
        .split('-')
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

/// Get the launchpad root directory
fn get_launchpad_root() -> Result<PathBuf, String> {
    // Try to get from environment or default to user's launchpad directory
    if let Ok(path) = std::env::var("LAUNCHPAD_ROOT") {
        return Ok(PathBuf::from(path));
    }
    
    // Default to C:\Users\{user}\launchpad on Windows
    if let Some(home) = dirs::home_dir() {
        let launchpad = home.join("launchpad");
        if launchpad.exists() {
            return Ok(launchpad);
        }
    }
    
    // Fallback to current directory
    std::env::current_dir().map_err(|e| format!("Failed to get current directory: {}", e))
}

/// Ensure vault directories exist
fn ensure_vault_dirs(root: &PathBuf) -> Result<(), String> {
    let dirs = [
        root.join("_vault"),
        root.join("_vault").join("backlog"),
        root.join("_vault").join("active"),
        root.join("_vault").join("killed"),
    ];
    
    for dir in dirs {
        if !dir.exists() {
            fs::create_dir_all(&dir).map_err(|e| format!("Failed to create directory {:?}: {}", dir, e))?;
        }
    }
    
    Ok(())
}

/// Get current date in YYYY-MM-DD format
fn get_current_date() -> String {
    chrono::Utc::now().format("%Y-%m-%d").to_string()
}

// =============================================================================
// Input/Output Types
// =============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateIdeaFileInput {
    pub name: String,
    pub problem_statement: String,
    pub proposed_solution: String,
    pub source: String,
    pub source_details: Option<String>,
    pub who_has_problem: Option<String>,
    pub pain_description: Option<String>,
    pub current_solution: Option<String>,
    pub searched_for_solutions: Option<bool>,
    pub would_you_pay: Option<String>,
    pub price_point_guess: Option<String>,
    pub know_someone_with_pain: Option<bool>,
    pub is_painful: Option<bool>,
    pub is_feasible: Option<bool>,
    pub can_generate_revenue: Option<bool>,
    pub additional_notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateIdeaFileInput {
    pub slug: String,
    pub field: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateContractFileInput {
    pub slug: String,
    pub product_name: String,
    pub value_proposition: String,
    pub bar_napkin_pitch: String,
    pub features: Vec<String>,
    pub non_goals: Vec<String>,
    pub launch_day_customers: i32,
    pub launch_day_revenue: i32,
    pub thirty_day_revenue: i32,
    pub thirty_day_active_users: i32,
    pub thirty_day_churn_target: i32,
    pub price_point: f64,
    pub customers_needed_30_day: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRevenueFileInput {
    pub slug: String,
    pub product_name: String,
    pub revenue_model: String,
    pub model_reasoning: String,
    pub price: f64,
    pub price_period: String,
    pub annual_discount: Option<i32>,
    pub competitor_a: String,
    pub competitor_b: String,
    pub positioning: String,
    pub value_delivered: String,
    pub trial_type: String,
    pub trial_reasoning: String,
    pub entry_point: String,
    pub paywall_trigger: String,
    pub cta_text: String,
    pub payment_method: String,
    pub access_grant: String,
    pub refund_policy: String,
    pub refund_conditions: Option<String>,
    pub launch_day_revenue: i32,
    pub thirty_day_revenue: i32,
    pub ninety_day_revenue: i32,
    pub launch_day_customers: i32,
    pub thirty_day_customers: i32,
    pub ninety_day_customers: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateDesignFileInput {
    pub slug: String,
    pub product_name: String,
    pub entry_point: String,
    pub hook_point: String,
    pub value_point: String,
    pub convert_point: String,
    pub success_point: String,
    pub screens: Vec<String>,
    pub hero_headline: String,
    pub hero_subheadline: String,
    pub hero_cta: String,
    pub hero_visual: String,
    pub features: Vec<DesignFeature>,
    pub pricing_display: String,
    pub pricing_includes: String,
    pub pricing_cta: String,
    pub core_interaction: String,
    pub form_submit_pattern: String,
    pub error_pattern: String,
    pub loading_pattern: String,
    pub components: Vec<String>,
    pub layout_choice: String,
    pub breakpoint_notes: Option<String>,
    pub additional_notes: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DesignFeature {
    pub icon: String,
    pub headline: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArtifactResult {
    pub success: bool,
    pub file_path: String,
    pub message: String,
}

// =============================================================================
// Tauri Commands
// =============================================================================

/// Create an idea file in the vault
#[tauri::command]
pub fn create_idea_file(input: CreateIdeaFileInput) -> Result<ArtifactResult, String> {
    let root = get_launchpad_root()?;
    ensure_vault_dirs(&root)?;
    
    let slug = slugify(&input.name);
    let file_path = root.join("_vault").join("backlog").join(format!("IDEA-{}.md", slug));
    let date = get_current_date();
    
    let content = format!(r#"# IDEA: {}

**Captured:** {}
**Source:** {}{}
**Status:** Backlog

## Problem Statement

**Who has this problem:** {}

**Pain description:** {}

**Current solutions:** {}

## Proposed Solution

{}

## Initial Signals

- **Searched for solutions?** {}
- **Would you pay for this?** {}{}
- **Know someone with this pain?** {}

## Triage

- **Painful problem:** {}
- **Technically feasible:** {}
- **Revenue in 30 days:** {}

## Raw Notes

{}
"#,
        input.name,
        date,
        input.source,
        input.source_details.as_ref().map(|s| format!(" ({})", s)).unwrap_or_default(),
        input.who_has_problem.as_deref().unwrap_or("Not specified"),
        input.pain_description.as_deref().unwrap_or(&input.problem_statement),
        input.current_solution.as_deref().unwrap_or("Not specified"),
        input.proposed_solution,
        bool_to_yesno(input.searched_for_solutions),
        input.would_you_pay.as_deref().unwrap_or("Not specified"),
        input.price_point_guess.as_ref().map(|p| format!(" ({})", p)).unwrap_or_default(),
        bool_to_yesno(input.know_someone_with_pain),
        bool_to_yesno(input.is_painful),
        bool_to_yesno(input.is_feasible),
        bool_to_yesno(input.can_generate_revenue),
        input.additional_notes.as_deref().unwrap_or(""),
    );
    
    fs::write(&file_path, content).map_err(|e| format!("Failed to write file: {}", e))?;
    
    // Also update IDEAS.md index
    update_ideas_index(&root, &slug, &input.name, "Backlog", &date)?;
    
    Ok(ArtifactResult {
        success: true,
        file_path: file_path.to_string_lossy().to_string(),
        message: format!("Created idea file: IDEA-{}.md", slug),
    })
}

/// Update an existing idea file
#[tauri::command]
pub fn update_idea_file(input: UpdateIdeaFileInput) -> Result<ArtifactResult, String> {
    let root = get_launchpad_root()?;
    
    // Look in both backlog and active directories
    let mut file_path = root.join("_vault").join("backlog").join(format!("IDEA-{}.md", input.slug));
    if !file_path.exists() {
        file_path = root.join("_vault").join("active").join(format!("IDEA-{}.md", input.slug));
    }
    
    if !file_path.exists() {
        return Err(format!("Idea file not found: IDEA-{}.md", input.slug));
    }
    
    let content = fs::read_to_string(&file_path).map_err(|e| format!("Failed to read file: {}", e))?;
    
    // Simple field replacement - look for the field pattern and update it
    let updated = match input.field.as_str() {
        "status" => {
            // Move file to appropriate directory
            let new_dir = match input.value.as_str() {
                "Active" | "active" => "active",
                "Killed" | "killed" => "killed",
                _ => "backlog",
            };
            let new_path = root.join("_vault").join(new_dir).join(format!("IDEA-{}.md", input.slug));
            
            // Update status in content
            let updated = content.replace(
                &format!("**Status:** {}", extract_status(&content)),
                &format!("**Status:** {}", input.value),
            );
            
            // Move file
            if new_path != file_path {
                fs::write(&new_path, &updated).map_err(|e| format!("Failed to write file: {}", e))?;
                fs::remove_file(&file_path).map_err(|e| format!("Failed to remove old file: {}", e))?;
                return Ok(ArtifactResult {
                    success: true,
                    file_path: new_path.to_string_lossy().to_string(),
                    message: format!("Moved idea to {} and updated status", new_dir),
                });
            }
            updated
        }
        "validation_score" => {
            // Append validation score section if it doesn't exist
            if content.contains("## Validation Score") {
                content.replace(
                    &extract_section(&content, "## Validation Score"),
                    &format!("## Validation Score\n\n{}\n", input.value),
                )
            } else {
                format!("{}\n## Validation Score\n\n{}\n", content, input.value)
            }
        }
        _ => {
            // Generic field update - just append to notes for now
            format!("{}\n**{}:** {}\n", content, input.field, input.value)
        }
    };
    
    fs::write(&file_path, updated).map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(ArtifactResult {
        success: true,
        file_path: file_path.to_string_lossy().to_string(),
        message: format!("Updated {} in IDEA-{}.md", input.field, input.slug),
    })
}

/// Create an MVP contract file
#[tauri::command]
pub fn create_contract_file(input: CreateContractFileInput) -> Result<ArtifactResult, String> {
    let root = get_launchpad_root()?;
    ensure_vault_dirs(&root)?;
    
    let file_path = root.join("_vault").join("active").join(format!("CONTRACT-{}.md", input.slug));
    let date = get_current_date();
    
    // Format features list
    let features_md = input.features.iter()
        .enumerate()
        .map(|(i, f)| format!("{}. [ ] {}", i + 1, f))
        .collect::<Vec<_>>()
        .join("\n");
    
    // Format non-goals list
    let non_goals_md = input.non_goals.iter()
        .map(|ng| format!("- [ ] {}", ng))
        .collect::<Vec<_>>()
        .join("\n");
    
    let content = format!(r#"# MVP Contract: {}

**Date:** {}
**Status:** LOCKED

---

## Value Proposition

{}

**Bar Napkin Pitch:** {}

---

## MVP Features (P0 Only)

{}

**Total Features:** {} (max 5)

---

## Explicit Non-Goals (v1)

{}

---

## Success Metrics

| Metric | Target | Timeframe |
|--------|--------|----------|
| First paying customers | {} | Launch day |
| Launch day revenue | ${} | Launch day |
| Total revenue | ${} | First 30 days |
| Active users | {} | First 30 days |
| Max churn rate | {}% | First 30 days |

**Customer Math:**
- Price: ${}/period
- Customers needed for 30-day target: {}

---

## Scope Change Policy

Any feature addition requires:
1. Removing an existing P0 feature, OR
2. Explicit contract renegotiation with documented reasoning

**No exceptions. No "quick additions." No scope creep.**

---

## Signatures

- [x] Dalton commits to this scope
- [x] Claude commits to flagging scope creep

**Contract Date:** {}
"#,
        input.product_name,
        date,
        input.value_proposition,
        input.bar_napkin_pitch,
        features_md,
        input.features.len(),
        non_goals_md,
        input.launch_day_customers,
        input.launch_day_revenue,
        input.thirty_day_revenue,
        input.thirty_day_active_users,
        input.thirty_day_churn_target,
        input.price_point,
        input.customers_needed_30_day,
        date,
    );
    
    fs::write(&file_path, content).map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(ArtifactResult {
        success: true,
        file_path: file_path.to_string_lossy().to_string(),
        message: format!("Created contract file: CONTRACT-{}.md", input.slug),
    })
}

/// Create a revenue model file
#[tauri::command]
pub fn create_revenue_file(input: CreateRevenueFileInput) -> Result<ArtifactResult, String> {
    let root = get_launchpad_root()?;
    ensure_vault_dirs(&root)?;
    
    let file_path = root.join("_vault").join("active").join(format!("REVENUE-{}.md", input.slug));
    let date = get_current_date();
    
    let content = format!(r#"# Revenue Model: {}

**Date:** {}
**Status:** LOCKED

---

## Model Type

**Selected Model:** {}
**Reasoning:** {}

---

## Pricing

**Price Point:** ${} / {}{}

**Justification:**
- Competitor A charges: {}
- Competitor B charges: {}
- Our positioning: {}
- Value delivered: {}

---

## Trial Strategy

**Trial Type:** {}
**Reasoning:** {}

---

## Payment Flow

1. User arrives via: {}
2. Paywall triggers: {}
3. User clicks: "{}"
4. Payment via: {}
5. Access granted: {}
6. Receipt: Stripe automatic email

**Refund Policy:** {}
**Conditions:** {}

---

## Revenue Targets

| Timeframe | Revenue Target | Customers Needed |
|-----------|----------------|--------------------|
| Launch day | ${} | {} |
| 30 days | ${} | {} |
| 90 days | ${} | {} |

**Price:** ${}/{}
**Customer Math:** Targets calculated based on price point

---

## Stripe Setup Checklist

- [ ] Product created in Stripe
- [ ] Price created in Stripe
- [ ] Checkout link generated
- [ ] Webhook endpoint configured
- [ ] Test mode purchase verified

---

## Signatures

- [x] Pricing locked—no second-guessing
- [x] Payment flow defined—build exactly this

**Lock Date:** {}
"#,
        input.product_name,
        date,
        input.revenue_model,
        input.model_reasoning,
        input.price,
        input.price_period,
        input.annual_discount.map(|d| format!(" ({}% annual discount)", d)).unwrap_or_default(),
        input.competitor_a,
        input.competitor_b,
        input.positioning,
        input.value_delivered,
        input.trial_type,
        input.trial_reasoning,
        input.entry_point,
        input.paywall_trigger,
        input.cta_text,
        input.payment_method,
        input.access_grant,
        input.refund_policy,
        input.refund_conditions.as_deref().unwrap_or("No questions asked"),
        input.launch_day_revenue,
        input.launch_day_customers,
        input.thirty_day_revenue,
        input.thirty_day_customers,
        input.ninety_day_revenue,
        input.ninety_day_customers,
        input.price,
        input.price_period,
        date,
    );
    
    fs::write(&file_path, content).map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(ArtifactResult {
        success: true,
        file_path: file_path.to_string_lossy().to_string(),
        message: format!("Created revenue file: REVENUE-{}.md", input.slug),
    })
}

/// Create a design brief file
#[tauri::command]
pub fn create_design_file(input: CreateDesignFileInput) -> Result<ArtifactResult, String> {
    let root = get_launchpad_root()?;
    ensure_vault_dirs(&root)?;
    
    let file_path = root.join("_vault").join("active").join(format!("DESIGN-{}.md", input.slug));
    let date = get_current_date();
    
    // Format screens table
    let screens_md = input.screens.iter()
        .enumerate()
        .map(|(i, s)| format!("| {} | {} |", i + 1, s))
        .collect::<Vec<_>>()
        .join("\n");
    
    // Format features section
    let features_md = input.features.iter()
        .enumerate()
        .map(|(i, f)| format!("{}. **{}** ({}): {}", i + 1, f.headline, f.icon, f.description))
        .collect::<Vec<_>>()
        .join("\n");
    
    // Format components list
    let components_md = input.components.iter()
        .map(|c| format!("- [x] {}", c))
        .collect::<Vec<_>>()
        .join("\n");
    
    let content = format!(r#"# Design Brief: {}

**Date:** {}
**Design System:** Reference `_design-system/DESIGN_SYSTEM.md`

---

## Core User Flow

```
ENTRY → {}
  ↓
HOOK → {}
  ↓
VALUE → {}
  ↓
CONVERT → {}
  ↓
SUCCESS → {}
```

---

## Screen Inventory

| # | Screen |
|---|--------|
{}

---

## Landing Page Structure

### Hero
- **Headline:** {}
- **Subheadline:** {}
- **CTA:** {}
- **Visual:** {}

### Features Section
{}

### Pricing Section
- Display: {}
- Includes:
{}
- CTA: {}

---

## Key Interactions

| Element | Interaction | Feedback |
|---------|-------------|----------|
| Core Feature | {} |
| Form Submit | {} |
| Errors | {} |
| Loading | {} |

---

## Component Checklist (shadcn/ui)

{}

---

## Responsive Strategy

- **Mobile-first:** Yes
- **Breakpoints:** 320px → 768px → 1024px
- **Notes:** {}

---

## Design Decisions

| Decision | Choice | Reasoning |
|----------|--------|----------|
| Layout | {} | MVP simplicity |

**Additional Notes:**
{}
"#,
        input.product_name,
        date,
        input.entry_point,
        input.hook_point,
        input.value_point,
        input.convert_point,
        input.success_point,
        screens_md,
        input.hero_headline,
        input.hero_subheadline,
        input.hero_cta,
        input.hero_visual,
        features_md,
        input.pricing_display,
        input.pricing_includes,
        input.pricing_cta,
        input.core_interaction,
        input.form_submit_pattern,
        input.error_pattern,
        input.loading_pattern,
        components_md,
        input.breakpoint_notes.as_deref().unwrap_or("None"),
        input.layout_choice,
        input.additional_notes.as_deref().unwrap_or("None"),
    );
    
    fs::write(&file_path, content).map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(ArtifactResult {
        success: true,
        file_path: file_path.to_string_lossy().to_string(),
        message: format!("Created design file: DESIGN-{}.md", input.slug),
    })
}

/// Move an idea file between vault directories
#[tauri::command]
pub fn move_idea_file(slug: String, destination: String) -> Result<ArtifactResult, String> {
    let root = get_launchpad_root()?;
    ensure_vault_dirs(&root)?;
    
    // Find the source file
    let file_name = format!("IDEA-{}.md", slug);
    let possible_sources = ["backlog", "active", "killed"];
    let mut source_path: Option<PathBuf> = None;
    
    for dir in possible_sources {
        let path = root.join("_vault").join(dir).join(&file_name);
        if path.exists() {
            source_path = Some(path);
            break;
        }
    }
    
    let source = source_path.ok_or(format!("Idea file not found: {}", file_name))?;
    let dest_dir = match destination.to_lowercase().as_str() {
        "active" => "active",
        "killed" => "killed",
        _ => "backlog",
    };
    
    let dest = root.join("_vault").join(dest_dir).join(&file_name);
    
    if source == dest {
        return Ok(ArtifactResult {
            success: true,
            file_path: dest.to_string_lossy().to_string(),
            message: format!("File already in {}", dest_dir),
        });
    }
    
    // Update status in file content
    let content = fs::read_to_string(&source).map_err(|e| format!("Failed to read file: {}", e))?;
    let status = match dest_dir {
        "active" => "Active",
        "killed" => "Killed",
        _ => "Backlog",
    };
    let updated = content.replace(
        &format!("**Status:** {}", extract_status(&content)),
        &format!("**Status:** {}", status),
    );
    
    // Write to new location and remove old
    fs::write(&dest, updated).map_err(|e| format!("Failed to write file: {}", e))?;
    fs::remove_file(&source).map_err(|e| format!("Failed to remove old file: {}", e))?;
    
    Ok(ArtifactResult {
        success: true,
        file_path: dest.to_string_lossy().to_string(),
        message: format!("Moved {} to {}", file_name, dest_dir),
    })
}

/// List all artifacts in the vault
#[tauri::command]
pub fn list_vault_artifacts() -> Result<Vec<VaultArtifact>, String> {
    let root = get_launchpad_root()?;
    let vault = root.join("_vault");
    
    if !vault.exists() {
        return Ok(vec![]);
    }
    
    let mut artifacts = Vec::new();
    
    for dir_name in ["backlog", "active", "killed"] {
        let dir = vault.join(dir_name);
        if !dir.exists() {
            continue;
        }
        
        for entry in fs::read_dir(&dir).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let file_name = entry.file_name().to_string_lossy().to_string();
            
            if file_name.ends_with(".md") {
                let artifact_type = if file_name.starts_with("IDEA-") {
                    "idea"
                } else if file_name.starts_with("CONTRACT-") {
                    "contract"
                } else if file_name.starts_with("REVENUE-") {
                    "revenue"
                } else if file_name.starts_with("DESIGN-") {
                    "design"
                } else {
                    continue;
                };
                
                let slug = file_name
                    .trim_start_matches("IDEA-")
                    .trim_start_matches("CONTRACT-")
                    .trim_start_matches("REVENUE-")
                    .trim_start_matches("DESIGN-")
                    .trim_end_matches(".md")
                    .to_string();
                
                artifacts.push(VaultArtifact {
                    artifact_type: artifact_type.to_string(),
                    slug,
                    file_name,
                    directory: dir_name.to_string(),
                    path: entry.path().to_string_lossy().to_string(),
                });
            }
        }
    }
    
    Ok(artifacts)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VaultArtifact {
    pub artifact_type: String,
    pub slug: String,
    pub file_name: String,
    pub directory: String,
    pub path: String,
}

// =============================================================================
// Helper Functions
// =============================================================================

fn bool_to_yesno(opt: Option<bool>) -> &'static str {
    match opt {
        Some(true) => "Yes",
        Some(false) => "No",
        None => "Not specified",
    }
}

fn extract_status(content: &str) -> String {
    for line in content.lines() {
        if line.starts_with("**Status:**") {
            return line.replace("**Status:**", "").trim().to_string();
        }
    }
    "Backlog".to_string()
}

fn extract_section(content: &str, header: &str) -> String {
    let mut in_section = false;
    let mut section = String::new();
    
    for line in content.lines() {
        if line.starts_with(header) {
            in_section = true;
            section.push_str(line);
            section.push('\n');
            continue;
        }
        
        if in_section {
            if line.starts_with("## ") && !line.starts_with(header) {
                break;
            }
            section.push_str(line);
            section.push('\n');
        }
    }
    
    section
}

fn update_ideas_index(root: &PathBuf, slug: &str, name: &str, status: &str, date: &str) -> Result<(), String> {
    let index_path = root.join("_vault").join("IDEAS.md");
    
    let mut content = if index_path.exists() {
        fs::read_to_string(&index_path).unwrap_or_default()
    } else {
        r#"# Ideas Index

| Slug | Name | Status | Date |
|------|------|--------|------|
"#.to_string()
    };
    
    // Check if idea already exists in index
    if content.contains(&format!("| {} |", slug)) {
        // Update existing entry
        let lines: Vec<&str> = content.lines().collect();
        let updated: Vec<String> = lines.iter()
            .map(|line| {
                if line.contains(&format!("| {} |", slug)) {
                    format!("| {} | {} | {} | {} |", slug, name, status, date)
                } else {
                    line.to_string()
                }
            })
            .collect();
        content = updated.join("\n");
    } else {
        // Add new entry
        content.push_str(&format!("| {} | {} | {} | {} |\n", slug, name, status, date));
    }
    
    fs::write(&index_path, content).map_err(|e| format!("Failed to update IDEAS.md: {}", e))?;
    
    Ok(())
}

