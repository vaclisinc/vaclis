---
command: web-create-user-stories
description: Create user stories from a GitHub issue and generate subtasks with test scenarios
---

# Web Create User Stories

This command analyzes a GitHub issue, creates comprehensive user stories, and generates subtasks with integrated test scenarios based on those user stories.

## Usage

```
/web-create-user-stories <github-issue-url>
```

## Example

```
/web-create-user-stories https://github.com/myorg/myrepo/issues/123
```

## Process

### Step 1: Fetch and Analyze Issue

Extract the issue number from the URL and fetch issue details:

```
Use gh command via Bash tool:
- gh issue view <issue-number> --json title,body,labels,milestone,assignees,comments
- gh issue view <issue-number> --comments

Extract:
1. Issue title and description
2. Acceptance criteria
3. Milestone information
4. Labels and metadata
5. Technical requirements
```

### Step 2: Generate User Stories

Based on the issue analysis, create user stories following the format:

```
As a [user type]
I want to [action/feature]
So that [benefit/value]

Given [context]
When [action]
Then [expected outcome]
```

The user stories should cover:
1. **Happy Path Scenarios** - Primary use cases
2. **Edge Cases** - Boundary conditions and special cases
3. **Error Scenarios** - Failure handling
4. **Performance Scenarios** - Load and performance requirements
5. **Accessibility Scenarios** - Accessibility requirements

### Step 3: Create Test Scenarios

For each user story, define test scenarios:

```
User Story: [Story Title]
Test Type: [Unit/Integration/E2E]
Test Scenarios:
1. Scenario: [Description]
   - Given: [Setup]
   - When: [Action]
   - Then: [Assertion]
   - Test Data: [Required data]
   - Mock Requirements: [What to mock]
```

### Step 4: Map Test Requirements

Map each user story to specific test requirements:

```
User Story: [US-1]
Test Requirements:
- Unit Tests: [Specific unit test scenarios]
- Integration Tests: [API and data flow tests]
- E2E Tests: [User interaction tests]
- Performance Tests: [If applicable]
```

### Step 5: Present for Review

Display the user stories for confirmation:

```
📖 User Stories for Issue #123: [Issue Title]
🎯 Milestone: [Milestone Name]

== USER STORIES ==

🎯 US-1: [Title]
As a [user]
I want to [action]
So that [benefit]

Acceptance Criteria:
✓ Given [context] When [action] Then [outcome]
✓ Given [context] When [action] Then [outcome]

Test Coverage:
- Unit Test: [Test description]
- Integration Test: [Test description]
- E2E Test: [Test description]

---

🎯 US-2: [Title]
[User story details...]

== TEST STRATEGY SUMMARY ==

Unit Test Coverage:
- [ ] Data validation (US-1, US-2)
- [ ] Business logic (US-1, US-3, US-4)
- [ ] Error handling (US-5)

Integration Test Coverage:
- [ ] API integration (US-1, US-3)
- [ ] Database operations (US-2)
- [ ] End-to-end flows (US-1, US-4)

E2E Test Coverage:
- [ ] User interactions (US-1, US-2)
- [ ] Error states (US-5)
- [ ] Accessibility (US-6)

Do you want to:
1. ✅ Create user stories documentation issue
2. ✏️ Modify the user stories
3. ❌ Cancel
```

### Step 6: Create User Stories Documentation Issue

After user confirmation, create a single issue containing all user stories:

```
Create ONE issue using gh command:
- gh issue create --title "📖 User Stories Documentation for #123"
- --body [Complete user stories documentation]
- --label "documentation,user-stories"
- --milestone [Same as parent issue]

The issue serves as the single source of truth for all user stories
that other tasks can reference.
```

### Step 7: Create User Story Reference Document

Generate TWO reference documents:

1. **Local file for development reference:**
```
Write to: .claude/user-stories/issue-123-user-stories.md
```

2. **Content for the GitHub issue description:**

The GitHub issue should contain:
# User Stories for Issue #123

## Story Overview
[Original issue summary and acceptance criteria]

## User Stories

### US-1: [Title]
**Story:**
As a [user]...

**Test Scenarios:**
1. [Scenario with test details]
2. [Scenario with test details]

**Implementation Notes:**
- Data requirements
- Mock requirements
- Integration points

[Continue for all user stories...]

## Task Mapping

| Task | User Stories | Test Focus |
|------|-------------|------------|
| Task 1 | US-1, US-2 | Unit tests for validation |
| Task 2 | US-1, US-3 | Integration tests for API |

## Test Checklist

### Unit Tests
- [ ] US-1: Scenario 1 - Data validation
- [ ] US-1: Scenario 2 - Business logic
- [ ] US-2: Scenario 1 - Error handling

### Integration Tests
- [ ] US-1: End-to-end flow
- [ ] US-3: API error handling

### E2E Tests
- [ ] US-1: User interaction flow
- [ ] US-2: Error state display
```

## Web-Specific Test Considerations

### Unit Test Implementation (Jest/Vitest)
```javascript
// Reference: US-1 - User wants to save preferences
describe('PreferencesService', () => {
  it('should persist valid preferences to storage', async () => {
    // Given - Setup from US-1 scenario
    const preferences = createTestPreferences();
    
    // When - Action from US-1
    await preferencesService.save(preferences);
    
    // Then - Expected outcome from US-1
    expect(mockStorage.setItem).toHaveBeenCalledWith('preferences', preferences);
    expect(preferencesService.getState()).toBe('success');
  });
});
```

### Integration Test Implementation (Playwright/Cypress)
```javascript
// Reference: US-3 - User handles network errors
describe('API Error Handling', () => {
  it('should display error state on network failure', () => {
    // Setup mock server based on US-3 error scenario
    cy.intercept('GET', '/api/data', { statusCode: 500 });
    
    // Execute action from US-3
    cy.visit('/dashboard');
    cy.get('[data-testid="fetch-button"]').click();
    
    // Verify outcome matches US-3 acceptance criteria
    cy.get('[data-testid="error-message"]').should('contain', 'Network error');
  });
});
```

### E2E Test Implementation (Playwright)
```javascript
// Reference: US-1 - User completes primary flow
test('user can complete preferences flow', async ({ page }) => {
  // Navigate to feature
  await page.goto('/preferences');
  
  // Execute steps from US-1 acceptance criteria
  await page.fill('[data-testid="preference-input"]', 'value');
  await page.click('[data-testid="save-button"]');
  
  // Verify outcome from US-1
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

## Benefits of This Approach

1. **Test Clarity**: Every test directly maps to a user story
2. **Coverage Confidence**: No user story is left untested
3. **Team Alignment**: Everyone understands what's being tested and why
4. **Documentation**: User stories serve as living documentation
5. **Traceability**: Easy to track from requirement to test
6. **Parallel Development**: Teams can work on different user stories simultaneously

## Integration with Other Commands

### With web-story-breakdown
When `/web-story-breakdown` creates implementation tasks:
1. It should reference the user stories documentation issue
2. Each implementation task links to relevant user stories
3. Test requirements derived from user stories

### With web-task-implementation  
When using `/web-task-implementation` on implementation tasks:
1. The command reads the user stories documentation issue
2. Finds relevant user stories for the task
3. Generates tests based on those specific user stories
4. Ensures test coverage matches user story acceptance criteria

## Common User Story Patterns

### CRUD Operations
```
US: Create [Entity]
As a user, I want to create a new [entity]
So that I can [benefit]

US: Read [Entity]
As a user, I want to view [entity] details
So that I can [benefit]

US: Update [Entity]
As a user, I want to edit [entity]
So that I can [benefit]

US: Delete [Entity]
As a user, I want to remove [entity]
So that I can [benefit]
```

### Error Handling
```
US: Handle Network Errors
As a user, I want to see clear error messages when network fails
So that I understand what went wrong and can retry

US: Handle Invalid Input
As a user, I want validation feedback on my input
So that I can correct mistakes before submitting
```

### Performance
```
US: Fast Loading
As a user, I want the [feature] to load within 2 seconds
So that I have a smooth experience

US: Offline Support
As a user, I want to access [feature] offline
So that I can use the app without internet
```