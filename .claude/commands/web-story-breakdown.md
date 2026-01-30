---
command: web-story-breakdown
description: Break down a GitHub issue into tasks and create sub-issues
---

# Web Story Breakdown

This command analyzes a GitHub issue and creates sub-issues for web development tasks.

## Usage

```
/web-story-breakdown <github-issue-url>
```

## Example

```
/web-story-breakdown https://github.com/myorg/myrepo/issues/123
```

## Process

1. **Fetch Issue Details**
   - Extract the issue number from the provided URL
   - Retrieve issue details including title, description, and acceptance criteria
   - Get the milestone information from the parent issue

2. **Fetch User Stories Documentation**
   - Search for existing User Stories Documentation issue linked to the parent issue:
     ```bash
     gh issue list --search "User Stories Documentation for #123"
     ```
   - If found, extract from the issue description:
     - All user stories with acceptance criteria (formatted as US-1, US-2, etc.)
     - Test scenarios for each user story
     - Test data and mock requirements
     - Implementation notes
     - Task mapping suggestions
   - Use this as context for task breakdown and test planning
   - Each implementation task will reference specific user stories by their ID

3. **Analyze Issue Content**
   - Parse the issue description and acceptance criteria
   - Cross-reference with user stories documentation (if exists)
   - Identify technical requirements and dependencies
   - Map user stories to implementation tasks
   - Consider web-specific implementation needs

4. **Generate Task Breakdown**
   Based on modern web architecture, user stories documentation, and parallel development approach:
   
   **Phase 1 - Foundation (Can be done in parallel):**
   - Define types/interfaces and data models
   - Design UI components and layouts
   - Prepare test data and mocks
   
   **Phase 2 - Implementation (Some dependencies):**
   - Implement API/Service layer (depends on interfaces)
   - Implement state management (depends on interfaces, can use mocks)
   - Write unit tests for business logic (based on user story test scenarios)
   
   **Phase 3 - Integration:**
   - Implement UI components (depends on state and layouts)
   - API integration and error handling
   - E2E tests covering full feature flow (aligned with user story acceptance criteria)
   - Documentation and code review

5. **Present Breakdown for Review**
   - Display the proposed task breakdown in a structured format
   - Show task titles, descriptions, and estimated effort
   - Map each task to relevant user stories (if documentation exists)
   - Show specific test scenarios from user stories for each task
   - Allow user to review and suggest modifications
   - Ask for confirmation before proceeding

6. **User Confirmation**
   - Wait for user approval or feedback
   - If changes are requested, update the task breakdown
   - Re-present the updated breakdown for confirmation

7. **Create GitHub Issues with Branch Strategy**
   - Only after user confirmation, create sub-issues under the parent issue
   - Use appropriate labels (e.g., "task", "frontend", "backend", "testing")
   - Set appropriate priorities
   - Add descriptions with implementation details
   - **Add branch strategy to each task description:**
     - Phase 1 tasks: Can use separate worktrees if truly independent
     - Phase 2-3 tasks: Should use same feature branch/worktree
     - Dependent tasks: MUST use same branch as their dependencies
   - Link tasks to the parent issue using GitHub's task list syntax
   - Assign all tasks to the same milestone as the parent issue
   - Report creation status for each task

## Task Template

Each generated task will include:
- Clear task title
- Detailed description with implementation approach
- **User Story References**: Links to specific user stories from documentation (e.g., "Implements US-1, US-3")
- Pass criteria (specific measurable outcomes)
  - For development tasks: Unit test requirements mapped to user story test scenarios
  - For testing tasks: Test coverage requirements for specific user story acceptance criteria
  - For documentation tasks: Deliverable requirements
- **Test Scenarios**: Specific test cases from user stories that this task must cover
- Estimated time (if possible)
- Dependencies on other tasks (marked as "Depends on: #task-number" or "No dependencies - can start immediately")
- Development phase (Phase 1/2/3) for parallel execution planning
- **Branch Strategy**: 
  - `worktree: standalone` - Can use separate worktree
  - `worktree: shared-feature/[parent-issue]` - Must use shared feature worktree
  - `branch: depends-on-#[issue]` - Must build on top of another task's work

## Web-Specific Considerations

The breakdown will consider:
- TDD with integration testing focus
- Component-based architecture (React/Vue/Angular)
- State management patterns (Redux/Zustand/Pinia)
- API integration patterns (REST/GraphQL)
- Testing frameworks:
  - Jest/Vitest for unit testing
  - React Testing Library/Vue Test Utils
  - Playwright/Cypress for E2E testing
  - MSW for API mocking
- Build tools (Vite/Webpack/Next.js)
- TypeScript considerations

## Common GitHub Issue Creation

### Creating Sub-Issues
```bash
# Create a sub-issue with task list reference
gh issue create \
  --title "📐 Define interfaces and data models" \
  --body "## Description
  Create TypeScript interfaces and data models for [feature]
  
  ## User Stories
  Implements US-1, US-2 from #123
  
  ## Pass Criteria
  - [ ] All interfaces documented with JSDoc
  - [ ] Data models include validation
  - [ ] Types exported from index file
  
  ## Test Focus
  - Data validation scenarios from US-1
  - Edge cases from US-2
  
  ## Dependencies
  None - can start immediately
  
  ## Branch Strategy
  - Worktree: `shared-feature/issue-123`
  - All Phase 1 tasks can work in parallel in same worktree
  - Commit frequently but don't push until integration tested
  
  ## Phase
  Phase 1 - Foundation" \
  --label "task,frontend" \
  --milestone "Sprint 23"
```

### Linking to Parent Issue
After creating sub-issues, update the parent issue to include task list:
```bash
gh issue edit 123 --body "$(gh issue view 123 --json body -q .body)

## Tasks
- [ ] #124 Define interfaces and data models
- [ ] #125 Design UI components
- [ ] #126 Implement service layer
- [ ] #127 Write integration tests"
```

## Confirmation Format

The task breakdown will be presented in the following format for review:

```
📋 Task Breakdown for Issue #123: [Issue Title]
🎯 Milestone: [Milestone Name]
📖 User Stories Documentation: [Found/Not Found]
🧪 Development Approach: Component-based with Parallel Development Phases

== USER STORIES MAPPING (if documentation exists) ==
- US-1: [User story title] → Tasks 1, 4, 8
- US-2: [User story title] → Tasks 2, 5, 8
- US-3: [User story title] → Tasks 3, 6, 7

== PHASE 1: Foundation (No dependencies - Can start immediately) ==

1. 📐 Define Interfaces & Data Models
   - Title: Define [feature] types and models
   - Description: Create TypeScript interfaces, types, and data models
   - User Stories: US-1, US-2 (if applicable)
   - Pass Criteria: All types documented, validation included
   - Test Focus: Data validation scenarios from user stories
   - Dependencies: None - can start immediately
   - Estimated Hours: [X]

2. 🎨 UI Component Design
   - Title: Create [feature] UI components
   - Description: Design React/Vue components, prepare styles
   - Pass Criteria: Components match design specs, responsive
   - Dependencies: None - can start immediately
   - Estimated Hours: [X]

3. 🧪 Test Data & Mocks
   - Title: Prepare test data and mock services
   - Description: Create mock API responses, sample data for testing
   - Pass Criteria: Mocks cover all test scenarios, reusable
   - Dependencies: None - can start immediately
   - Estimated Hours: [X]

== PHASE 2: Core Implementation (Depends on Phase 1) ==

4. 💾 Service Layer Implementation
   - Title: Implement [feature] service/API layer
   - Description: Create services with error handling
   - Pass Criteria: Unit tests pass, handles error scenarios
   - Dependencies: Depends on Task 1 (Interfaces)
   - Estimated Hours: [X]

5. 🧩 State Management
   - Title: Implement [feature] state management
   - Description: Create store/context with actions and selectors
   - Pass Criteria: Unit tests >80% coverage, uses mock services
   - Dependencies: Depends on Task 1 (Interfaces) and Task 3 (Mocks)
   - Estimated Hours: [X]

== PHASE 3: Integration (Depends on Phase 2) ==

6. 📱 Component Implementation
   - Title: Implement [feature] UI components
   - Description: Connect components to state, handle interactions
   - Pass Criteria: Components render correctly, no memory leaks
   - Dependencies: Depends on Task 2 (UI) and Task 5 (State)
   - Estimated Hours: [X]

7. 🔗 API Integration
   - Title: Complete [feature] API integration
   - Description: Connect to real endpoints, implement error handling
   - Pass Criteria: All API scenarios tested, graceful error handling
   - Dependencies: Depends on Task 4 (Service)
   - Estimated Hours: [X]

8. ✅ E2E Tests
   - Title: Write E2E tests for [feature]
   - Description: End-to-end tests with Playwright/Cypress
   - Pass Criteria: All user flows covered, tests pass in CI
   - Dependencies: Depends on all implementation tasks
   - Estimated Hours: [X]

Total Estimated Hours: [X]

⚠️ All tasks will be created with the same milestone as the parent issue.
📌 Phase 1 tasks can be assigned to different developers immediately
🔄 Phase 2 can start as soon as relevant Phase 1 tasks complete

Do you want to:
1. ✅ Proceed with creating these tasks in GitHub
2. ✏️ Modify the breakdown
3. ❌ Cancel
```

## Integration with web-create-user-stories

When `/web-create-user-stories` has been run first:
1. The User Stories Documentation issue will be automatically detected
2. Each task in the breakdown will reference relevant user stories
3. Test requirements will be aligned with user story test scenarios
4. Implementation tasks will include specific acceptance criteria from user stories

Benefits of this integration:
- **Traceability**: Clear mapping from user stories → tasks → tests
- **Test Coverage**: Ensures all user story scenarios are covered
- **Consistency**: All team members work from the same user story definitions
- **Validation**: Easy to verify that implementation meets original requirements