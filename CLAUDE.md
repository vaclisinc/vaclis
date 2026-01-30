# Project Development Principles

## Git Worktree Strategy for Feature Development

### Problem
Creating separate branches for interdependent subtasks leads to:
- Merge conflicts
- Integration issues  
- Duplicated work
- Difficult testing of integrated features

### Solution: Smart Worktree Usage

#### 1. Standalone Issues
Issues with no dependencies use isolated worktrees:
```bash
git worktree add -b feature/issue-456 ../worktree-456 origin/main
```

#### 2. Feature with Multiple Subtasks
All related subtasks share ONE feature worktree:
```bash
# Parent issue #123 has subtasks #124, #125, #126
git worktree add -b feature/issue-123 ../worktree-123 origin/main

# All developers working on #124, #125, #126 use worktree-123
cd ../worktree-123
```

#### 3. Development Flow in Shared Worktree

**Phase 1 Tasks (Parallel Development):**
- Multiple developers work in same worktree
- Each commits their work with descriptive messages
- Don't push until integration tested

```bash
# Developer A working on interfaces (#124)
git add src/types/
git commit -m "feat: Add interfaces for feature #124"

# Developer B working on UI components (#125)  
git add src/components/
git commit -m "feat: Add UI components for feature #125"
```

**Phase 2-3 Tasks (Sequential/Dependent):**
- Build on top of Phase 1 commits
- Regular pulls from teammates' commits
- Test integration frequently

```bash
# Developer C working on service layer (#126) that depends on #124
git pull  # Get latest commits from teammates
# Implement using interfaces from #124
git commit -m "feat: Implement service layer #126"
```

#### 4. Final Integration and PR

Once all subtasks complete:
```bash
# In shared worktree
npm test  # Run all tests
npm run build  # Ensure build passes

# Create single PR for entire feature
git push origin feature/issue-123
gh pr create --title "feat: Complete feature #123" \
  --body "Implements #124, #125, #126"
```

### Branch Strategy Rules

1. **Independent Tasks** → Separate worktrees
2. **Related Subtasks** → Shared feature worktree  
3. **Dependent Tasks** → Same branch, sequential commits
4. **Never** create separate branches for subtasks of same feature

### Benefits
- Clean integration of related work
- Easy testing of complete feature
- Single PR for review
- Reduced merge conflicts
- Clear feature history

## Core Testing Philosophy

Every feature implementation MUST conclude with a blackbox test that validates the feature from the end-user's perspective. This test should exactly mirror the acceptance criteria from the parent ticket.

## Blackbox Testing Requirements

### Definition
A blackbox test validates functionality without knowledge of internal implementation. It tests WHAT the system does, not HOW it does it.

### Mandatory Testing Protocol

Every subtask MUST include a "Blackbox Verification" section in its pass criteria that:

1. **Uses Playwright MCP for browser automation**
2. **Follows the exact user journey from the parent ticket**
3. **Captures evidence (screenshots) at key points**
4. **Validates the complete end-to-end flow**

## Example Implementation

### Parent Ticket Example
**Title**: Add "Load Posts" button to user dashboard
**Acceptance Criteria**:
- User sees a "Load Posts" button on dashboard
- Clicking the button fetches user's posts from API
- Posts are displayed in a list below the button
- Loading state is shown while fetching
- Error message appears if fetch fails

### Subtask Pass Criteria Template

```markdown
## Pass Criteria

### Implementation Requirements
- [ ] Button component created and styled
- [ ] API integration implemented
- [ ] Loading state handled
- [ ] Error state handled
- [ ] Unit tests written (80% coverage)

### Blackbox Verification (MANDATORY)
Execute the following steps using Playwright MCP:

1. **Navigate to Application**
   ```
   mcp__playwright__browser_navigate to http://localhost:3000/dashboard
   ```

2. **Verify Initial UI**
   ```
   mcp__playwright__browser_snapshot - Capture page structure
   mcp__playwright__browser_take_screenshot - Document initial state
   ```
   - [ ] Verify "Load Posts" button is visible
   - [ ] Verify button has correct text and styling

3. **Test Primary Flow**
   ```
   mcp__playwright__browser_click on "Load Posts" button
   mcp__playwright__browser_wait_for loading indicator
   mcp__playwright__browser_snapshot - Capture loading state
   ```
   - [ ] Verify loading indicator appears
   - [ ] Wait for posts to load

4. **Validate Success State**
   ```
   mcp__playwright__browser_wait_for posts to appear
   mcp__playwright__browser_take_screenshot - Document posts displayed
   mcp__playwright__browser_snapshot - Verify DOM structure
   ```
   - [ ] Verify posts are displayed
   - [ ] Verify each post has title and content
   - [ ] Verify layout matches design specs

5. **Test Error Handling** (if applicable)
   ```
   // Simulate network error or use test account with no posts
   mcp__playwright__browser_click on "Load Posts" button
   mcp__playwright__browser_wait_for error message
   mcp__playwright__browser_take_screenshot - Document error state
   ```
   - [ ] Verify error message is user-friendly
   - [ ] Verify retry option is available

### Evidence Collection
- [ ] Screenshot of initial page load saved
- [ ] Screenshot of loading state captured
- [ ] Screenshot of successful posts display saved
- [ ] Screenshot of error state documented (if tested)
- [ ] All screenshots attached to PR/ticket
```

## Testing Principles

### 1. User-Centric Validation
- Test from the user's perspective, not the developer's
- Follow the exact steps a real user would take
- Validate what the user sees, not what the code does

### 2. Evidence-Based Verification
- Every test assertion must be supported by visual evidence
- Screenshots provide proof of correct implementation
- DOM snapshots ensure structural integrity

### 3. Comprehensive Coverage
- Happy path (success scenario)
- Loading/transition states
- Error scenarios
- Edge cases mentioned in parent ticket

### 4. Playwright MCP Standard Commands

Always use these Playwright MCP commands for consistency:

```javascript
// Navigation
mcp__playwright__browser_navigate({ url: "http://localhost:3000" })

// Interaction
mcp__playwright__browser_click({ element: "button text", ref: "element-ref" })

// Validation
mcp__playwright__browser_snapshot() // Capture DOM structure
mcp__playwright__browser_take_screenshot({ filename: "feature-state.png" })

// Waiting
mcp__playwright__browser_wait_for({ text: "Expected content" })

// Form interaction
mcp__playwright__browser_fill_form({ fields: [...] })
```

## Implementation Workflow

### For Every Feature Implementation

1. **Read Parent Ticket** → Extract exact user requirements
2. **Implement Feature** → Build according to specifications
3. **Write Unit Tests** → Test individual components
4. **Write Integration Tests** → Test component interactions
5. **Execute Blackbox Test** → Validate from user perspective
6. **Collect Evidence** → Screenshot all states
7. **Document Results** → Attach evidence to PR/ticket

## Blackbox Test Template Generator

When creating subtasks, use this template for the Blackbox Verification section:

```markdown
### Blackbox Verification Steps

#### Setup
1. Start development server: `npm run dev`
2. Open Playwright browser: `mcp__playwright__browser_navigate`

#### Test Execution
1. **Step 1: [User Action]**
   - Command: `mcp__playwright__[specific_command]`
   - Expected: [What should happen]
   - Evidence: Screenshot saved as `step1-[description].png`

2. **Step 2: [User Action]**
   - Command: `mcp__playwright__[specific_command]`
   - Expected: [What should happen]
   - Evidence: Screenshot saved as `step2-[description].png`

[Continue for all user journey steps]

#### Validation Checklist
- [ ] All acceptance criteria from parent ticket verified
- [ ] Screenshots captured for each significant state
- [ ] Error scenarios tested (if applicable)
- [ ] Performance acceptable (page loads < 3s)
- [ ] Accessibility verified (if specified)
```

## Common Blackbox Test Scenarios

### Form Submission
```markdown
1. Navigate to form page
2. Screenshot empty form
3. Fill invalid data → Verify validation messages
4. Fill valid data → Submit
5. Verify success message/redirect
6. Screenshot final state
```

### Data Display
```markdown
1. Navigate to page
2. Verify loading state
3. Wait for data load
4. Verify data displayed correctly
5. Test sorting/filtering (if applicable)
6. Screenshot populated view
```

### User Authentication
```markdown
1. Navigate to login
2. Test invalid credentials → Verify error
3. Test valid credentials → Verify redirect
4. Verify authenticated state indicators
5. Test logout → Verify return to login
```

## Enforcement

### Definition of Done
A task is NOT complete until:
1. ✅ Code implemented
2. ✅ Unit tests pass
3. ✅ Integration tests pass
4. ✅ **Blackbox test executed successfully**
5. ✅ **Screenshots/evidence attached**
6. ✅ PR approved

### Review Checklist
Before approving any PR:
- [ ] Does the PR include blackbox test results?
- [ ] Are screenshots attached showing all states?
- [ ] Do the test steps match parent ticket requirements?
- [ ] Has the test been run on localhost:3000 (or appropriate port)?

## Benefits

1. **Quality Assurance**: Features work as users expect
2. **Documentation**: Screenshots serve as visual documentation
3. **Regression Prevention**: Blackbox tests catch user-facing breaks
4. **Stakeholder Confidence**: Visual evidence proves implementation
5. **Reduced Bug Reports**: User perspective testing catches issues early

---

**Remember**: If a user can't successfully use the feature following the parent ticket's acceptance criteria, the implementation is incomplete, regardless of how many unit tests pass.