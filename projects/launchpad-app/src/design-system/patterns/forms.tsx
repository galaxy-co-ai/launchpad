/**
 * Launchpad Form Patterns
 * Reusable form layouts and components
 *
 * Copy these patterns for instant professional forms
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ============================================================================
// PATTERN 1: Simple Form
// ============================================================================

/**
 * Basic form with label/input pairs
 * Used in: Quick actions, simple dialogs
 */
export function SimpleFormPattern() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </form>
  );
}

// ============================================================================
// PATTERN 2: Card Form
// ============================================================================

/**
 * Form inside a card container
 * Used in: Settings pages, profile edits
 */
export function CardFormPattern() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Form Title</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Brief description of what this form does
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Acme Inc." />
            <p className="text-xs text-muted-foreground">
              Your company or organization name
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// PATTERN 3: Multi-Section Form
// ============================================================================

/**
 * Multi-section form for complex data entry
 * Used in: Project creation, settings, multi-step forms
 */
export function MultiSectionFormPattern() {
  return (
    <form className="space-y-8">
      {/* Section 1 */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the essential details
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input id="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" required />
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Project Details</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Optional information about your project
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="localPath">Local Path</Label>
            <Input id="localPath" placeholder="C:\Projects\my-app" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" placeholder="https://github.com/..." />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
}

// ============================================================================
// PATTERN 4: Inline Edit Form
// ============================================================================

/**
 * Inline editing pattern
 * Used in: Quick edits, property lists
 */
export function InlineEditPattern() {
  return (
    <div className="space-y-3">
      {/* Editable Field */}
      <div className="flex items-center gap-2">
        <Label className="w-32 text-sm">Name:</Label>
        <div className="flex-1 flex items-center gap-2">
          <Input defaultValue="My Project" className="flex-1" />
          <Button size="sm">Save</Button>
        </div>
      </div>

      {/* Editable Field */}
      <div className="flex items-center gap-2">
        <Label className="w-32 text-sm">Path:</Label>
        <div className="flex-1 flex items-center gap-2">
          <Input defaultValue="C:\Projects\my-app" className="flex-1" />
          <Button size="sm">Save</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXPORT ALL PATTERNS
// ============================================================================

const formPatterns = {
  SimpleFormPattern,
  CardFormPattern,
  MultiSectionFormPattern,
  InlineEditPattern,
};

export default formPatterns;
