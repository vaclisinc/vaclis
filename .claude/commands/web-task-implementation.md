---
description: Implement a GitHub issue with dependency checking, planning, and status management
params:
  - name: issue
    description: GitHub issue number or URL (e.g., 123 or https://github.com/org/repo/issues/123)
    required: true
---

# Web Task Implementation Command

This command implements a GitHub issue following a structured workflow using git branches for isolated development:

1. **Setup git branch** - Create feature branch for the issue
2. **Read issue content** - Extract requirements AND test focus areas
3. **Check dependencies** - Verify all dependent issues are closed
4. **Read parent issue** - If exists, understand the broader context
5. **Analyze completed dependencies** - Read comments to understand implementation details
6. **Create implementation plan** - Present plan with SPECIFIC test requirements for user approval
7. **Implement** - Execute the approved plan INCLUDING mandatory unit tests
8. **Verify tests** - Ensure tests are written and passing before completion
9. **Commit changes** - Commit implementation with descriptive message after tests pass
10. **Create Pull Request** - Create PR with implementation details and test coverage

## Step 1: Read Issue Content

First, let me read the GitHub issue {{issue}} to understand the requirements.

<Task>
<description>Read GitHub issue</description>
<prompt>
Use the gh command via Bash tool to read issue {{issue}}:
- If {{issue}} is a URL, extract the issue number
- gh issue view {{issue}} --json title,body,labels,milestone,assignees,comments

Extract and report:
1. Title and description
2. Issue labels
3. Current state (open/closed)
4. Assignee
5. Any blocking issues (look for "Depends on #" or "Blocked by #" references)
6. Parent issue (if referenced)
7. Milestone (if exists)
8. Acceptance criteria or requirements
9. **TEST FOCUS SECTION** - Extract EXACTLY what tests are required
10. **PASS CRITERIA** - Extract verification requirements
11. Any specific testing requirements mentioned anywhere in the description
</prompt>
</Task>

## Step 2: Check Dependencies

<Task>
<description>Check dependency status</description>
<prompt>
Search for issues that block {{issue}}:
- Look for "Depends on #" or "Blocked by #" in the issue body
- For each blocking issue found, check its status using:
  gh issue view [issue-number] --json state

For each blocking issue found:
1. Check if state is "closed"
2. If any are not closed, list them with their current state
3. If all are closed, proceed to next step

If there are open dependencies, stop and report which issues need to be completed first.
</prompt>
</Task>

## Step 3: Read Parent Issue Context

<Task>
<description>Read parent issue</description>
<prompt>
If the issue references a parent issue (e.g., "Part of #100"):
1. Use gh issue view to read the parent issue
2. Extract the overall context and goals
3. Understand how {{issue}} fits into the larger feature

Report the parent context if found.
</prompt>
</Task>

## Step 4: Analyze Completed Dependencies

<Task>
<description>Analyze dependency implementations</description>
<prompt>
For each completed dependency found in Step 2:
1. Use gh issue view [issue-number] --comments
2. Read the comments to understand:
   - What was implemented
   - Which files were modified
   - Any APIs or interfaces created
   - Any important implementation decisions
3. Look for linked PRs and review them if necessary:
   gh pr view [pr-number] --json files,commits

Summarize the relevant implementation details from dependencies.
</prompt>
</Task>

## Step 5: Identify Existing Tests and Create Implementation Plan

First, let me check existing test structure:

<Task>
<description>Analyze existing test structure</description>
<prompt>
1. Use Glob to find existing test files related to the feature area:
   - Search for "*.test.{js,jsx,ts,tsx}" and "*.spec.{js,jsx,ts,tsx}" files
   - Look specifically for tests in the same feature area

2. Read 1-2 existing test files to understand:
   - Testing framework used (Jest, Vitest, etc.)
   - Test structure and patterns
   - Mocking approaches (MSW, jest mocks, etc.)
   - Assertion styles

3. Report:
   - Test file locations
   - Testing patterns observed
   - Test coverage gaps for the new feature
</prompt>
</Task>

Based on the issue requirements and dependency analysis, I'll create an implementation plan:

<TodoWrite>
<todos>
[
  {
    "id": "analyze-requirements",
    "content": "Analyze issue requirements and acceptance criteria",
    "status": "pending",
    "priority": "high"
  },
  {
    "id": "identify-test-requirements",
    "content": "Extract specific test requirements from Test Focus section",
    "status": "pending",
    "priority": "high"
  },
  {
    "id": "create-plan",
    "content": "Create detailed implementation plan with SPECIFIC test cases",
    "status": "pending",
    "priority": "high"
  }
]
</todos>
</TodoWrite>

<Task>
<description>Create implementation plan with mandatory tests</description>
<prompt>
Based on the issue {{issue}} requirements, Test Focus section, and existing test patterns:

1. Create a detailed implementation plan including:
   - Files to modify or create
   - Key implementation steps
   - Integration points with completed dependencies
   - Any architectural decisions needed

2. Create SPECIFIC test plan based on the Test Focus section:
   - List EACH test file to create with exact name and location
   - For each test file, list specific test methods to implement
   - Example test structure:
     * `PreferencesForm.test.tsx` - Tests for form validation
       - `should disable submit button when input is empty`
       - `should enable submit button when input is valid`
       - `should show validation errors for invalid input`
     * `preferences.service.test.ts` - Tests for service layer
       - `should save preferences to API`
       - `should handle network errors gracefully`
   - Specify testing frameworks to use (Jest/Vitest, React Testing Library, MSW)
   - Include both unit tests AND E2E tests if mentioned in Test Focus

3. Present the plan in a clear, structured format for user approval

IMPORTANT: The test plan MUST directly address EVERY item in the "Test Focus" section of the issue.
The plan should be specific to the web codebase following patterns in CLAUDE.md.
</prompt>
</Task>

**Implementation Plan:**

[Plan will be generated here]

**Verification Steps:**

[Verification steps will be generated here]

## Do you approve this implementation plan? (yes/no)

## Step 6: Setup Development Environment

<Task>
<description>Setup git worktree or use existing branch</description>
<prompt>
Determine the appropriate development setup based on dependencies:

1. **Check if this issue is part of a larger feature:**
   - Look for parent issue or epic reference
   - Check if other related subtasks exist
   - Look for existing feature branch or worktree

2. **If standalone issue (no dependencies):**
   ```bash
   # Create a new worktree for isolated development
   git worktree add -b feature/issue-{{issue}} ../worktree-{{issue}} origin/main
   cd ../worktree-{{issue}}
   ```

3. **If part of a feature with dependencies:**
   ```bash
   # Check for existing feature worktree
   git worktree list | grep feature/
   
   # If parent feature worktree exists, use it
   cd ../worktree-[parent-feature]
   
   # If not, create feature worktree for all related tasks
   git worktree add -b feature/[parent-issue] ../worktree-[parent-issue] origin/main
   cd ../worktree-[parent-issue]
   ```

4. **If dependencies exist in same feature:**
   - Work in the SAME worktree/branch as dependencies
   - Ensure previous work is committed but not pushed
   - Continue building on top of existing changes

Report the working directory and branch being used.
</prompt>
</Task>

<TodoWrite>
<todos>
[
  {
    "id": "implement-feature",
    "content": "Implement the feature according to the approved plan",
    "status": "pending",
    "priority": "high"
  },
  {
    "id": "write-unit-tests",
    "content": "Write unit tests covering ALL items from Test Focus section",
    "status": "pending",
    "priority": "high"
  },
  {
    "id": "write-e2e-tests",
    "content": "Write E2E tests if specified in Test Focus",
    "status": "pending",
    "priority": "medium"
  },
  {
    "id": "verify-test-coverage",
    "content": "Verify all Test Focus items have corresponding tests",
    "status": "pending",
    "priority": "high"
  },
  {
    "id": "run-verification",
    "content": "Run all verification steps (tests, lint, build)",
    "status": "pending",
    "priority": "high"
  }
]
</todos>
</TodoWrite>

Now implementing according to the approved plan...

<Task>
<description>Execute implementation with tests</description>
<prompt>
Implement the feature AND tests according to the approved plan:

1. FIRST implement the main feature:
   - Use appropriate tools (Read, Edit, MultiEdit, Write) to implement
   - Follow JavaScript/TypeScript conventions from the codebase
   - Integrate with any APIs or interfaces from dependencies

2. THEN implement ALL required tests from the test plan:
   - Create test files in the correct test directory (usually __tests__ or alongside source files)
   - Implement EACH test method specified in the plan
   - Use proper mocking for dependencies (MSW for API calls, jest.mock for modules)
   - Follow existing test patterns from the codebase
   - IMPORTANT: You MUST create actual test files, not just mention them

3. Verify test implementation:
   - List all test files created with their full paths
   - Show the test methods implemented in each file
   - Confirm each Test Focus item has corresponding test coverage

4. Run verification commands from package.json (npm test, npm run lint, etc.)

5. Mark todos as completed ONLY after actual implementation

CRITICAL: Do NOT skip test implementation. Tests are MANDATORY.
</prompt>
</Task>

## Step 7: Verify Test Implementation

<Task>
<description>Verify all tests were created</description>
<prompt>
MANDATORY verification before marking complete:

1. List all test files that were created:
   - Use Glob to find all new test files
   - Show their full paths
   
2. For each test file created:
   - Read the file and list all test methods
   - Confirm it addresses items from Test Focus section
   
3. Create a coverage matrix:
   - List each Test Focus item
   - Show which test method(s) cover it
   - Flag any Test Focus items WITHOUT test coverage

4. If any Test Focus items lack tests:
   - STOP and implement the missing tests
   - Do NOT proceed to completion

Report the verification results with specific file paths and method names.
</prompt>
</Task>

## Step 8: Complete and Create PR

<Task>
<description>Run final verification</description>
<prompt>
Run the final verification steps:
1. npm test (or yarn test) - MUST show the new tests running
2. npm run lint (or equivalent)
3. npm run build (or equivalent)
4. Any other verification steps from the plan

Report results including:
- Number of tests that ran
- All tests passing confirmation
- Any test failures (if any, fix them before proceeding)
</prompt>
</Task>

<Task>
<description>Commit changes</description>
<prompt>
Commit the implementation with a descriptive message:

git add .
git commit -m "feat: Implement #{{issue}} - [brief description]

- Implemented [main feature points]
- Added comprehensive test coverage:
  * [List test files created]
  * [Number of test cases added]
- All tests passing
- Closes #{{issue}}"
</prompt>
</Task>

<Task>
<description>Create Pull Request with test details</description>
<prompt>
Create a detailed PR using gh command:

gh pr create \
  --title "feat: Implement #{{issue}} - [title]" \
  --body "## Summary
  Implements #{{issue}} with full test coverage
  
  ## Changes
  - [List main implementation changes]
  
  ## Test Coverage
  ### Test Files Created
  - `path/to/test1.test.ts` - [description]
  - `path/to/test2.test.ts` - [description]
  
  ### Test Methods Implemented
  #### test1.test.ts
  - `test case 1 name`
  - `test case 2 name`
  
  #### test2.test.ts
  - `test case 1 name`
  - `test case 2 name`
  
  ### Test Focus Coverage
  - [x] Test Focus Item 1 - Covered by test1.test.ts
  - [x] Test Focus Item 2 - Covered by test2.test.ts
  - [x] Test Focus Item 3 - Covered by both test files
  
  ## Verification
  - ✅ All tests passing ([number] tests)
  - ✅ Lint checks passed
  - ✅ Build successful
  
  ## Screenshots (if UI changes)
  [Add screenshots if applicable]
  
  Closes #{{issue}}" \
  --label "enhancement" \
  --milestone [if applicable]

Report the PR URL and number.
</prompt>
</Task>

<Task>
<description>Final test verification gate</description>
<prompt>
BEFORE marking as complete, perform final check:

1. Confirm that test files exist (not just mentioned):
   - Use ls or Read to verify test files are actually on disk
   - If test files don't exist, STOP and report failure

2. Confirm Test Focus coverage:
   - Each Test Focus item MUST have at least one test
   - If any item lacks tests, STOP and report what's missing

3. Confirm PR includes test details:
   - PR description MUST list all test files
   - PR description MUST show test coverage mapping

Only mark as complete if all verifications pass.
</prompt>
</Task>

## Implementation Complete

The issue {{issue}} has been implemented, verified, and a PR has been created with:
- All dependencies verified as complete
- Implementation following the approved plan
- **ALL Test Focus items covered by unit/E2E tests**
- Tests written, executed, and passing
- Code quality checks passed
- Pull Request created with implementation and test details

[Summary of implementation and test coverage will appear here]