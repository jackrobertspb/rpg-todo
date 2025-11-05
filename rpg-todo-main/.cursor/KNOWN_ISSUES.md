# Known Issues and Technical Debt

Last Updated: 2025-11-05

## Critical Issues (Must Fix Before Production)

**None currently** - App is functional with no breaking bugs.

---

## High Priority Issues

### 1. Achievement Notifications Not Visible

**Issue**: Achievements are detected and awarded, but no visual notification is shown to user.

**Current Behavior**:
- Backend returns `new_achievements` array in API response
- Frontend logs achievements to console
- No toast/notification UI component

**Expected Behavior**:
- Show toast notification when achievement unlocked
- Display achievement name, description, icon
- Show XP bonus earned
- Animate achievement unlock

**Location**:
- `client/src/pages/Dashboard.jsx` line 155-162
- `client/src/pages/Dashboard.jsx` line 199-206

**Fix Required**:
- Implement toast notification component (using Radix Toast or similar)
- Call toast on achievement unlock
- Add achievement unlock animation/modal

**Priority**: High (core feature not visible to users)

---

### 2. Missing Achievements in Seed Data

**Issue**: PRD mentions achievements that aren't in seed file.

**Missing Achievements**:
1. **Level 20 Achiever** - PRD line 95 mentions levels 5, 10, 15, 20
   - Seed file only has 5, 10, 15
2. **Label Creator II** (5 labels) - PRD line 96 mentions 3, 5, 10 labels
   - Seed file only has Label Creator I (3 labels)
3. **Label Creator III** (10 labels) - Same as above

**Current Seed Count**: 10 achievements (as specified in PRD line 285 acceptance criteria)

**Discrepancy**: PRD user stories mention more achievements than acceptance criteria

**Options**:
1. Keep 10 achievements (as per acceptance criteria) - Current implementation
2. Add missing achievements to reach 13 total - Matches all user stories

**Recommendation**: Add missing achievements (Label Creator II, III, Level 20) and update acceptance criteria to 13 achievements.

**Location**:
- `supabase/migrations/002_seed_data.sql` line 29-48

**Priority**: High (inconsistency between PRD and implementation)

---

### 3. No Task Edit/Delete UI

**Issue**: Backend API supports task edit and delete, but no UI to access these features.

**Current Behavior**:
- Tasks can be created and completed
- No way to edit task details (title, description, priority, labels)
- No way to delete tasks

**Expected Behavior**:
- Edit button on each task
- Delete button on each task
- Edit modal with pre-filled form
- Confirmation dialog for delete

**Backend API Exists**:
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**Location**:
- `client/src/components/TaskList.jsx` (add buttons)
- `client/src/components/TaskForm.jsx` (support edit mode)

**Priority**: High (basic CRUD operations incomplete)

---

## Medium Priority Issues

### 4. Profile Picture Upload Not Implemented

**Issue**: Database has `profile_picture_url` field, but no upload functionality.

**Current Behavior**:
- Profile picture field exists in database
- No UI to upload images
- No file handling on backend

**Expected Behavior**:
- Upload button on profile page
- Image cropping/resizing
- Store image in Supabase Storage
- Update profile_picture_url in database

**Location**:
- `client/src/pages/Profile.jsx` (add upload UI)
- `server/src/routes/profile.js` (add upload endpoint)
- Supabase Storage setup required

**Priority**: Medium (nice to have, not critical)

---

### 5. Tutorial Could Be More Interactive

**Issue**: Tutorial is basic step-by-step text, not very engaging.

**Current Behavior**:
- Modal with text steps
- Generic instructions
- No interaction with actual UI elements

**Expected Behavior**:
- Highlight actual UI elements (e.g., "Create Task" button)
- Allow user to perform actions during tutorial
- Show tooltips pointing to specific parts of UI
- More engaging animations

**Location**:
- `client/src/components/Tutorial.jsx`

**Priority**: Medium (UX improvement)

---

### 6. No Loading States on Individual Actions

**Issue**: Some actions lack loading indicators.

**Current Behavior**:
- Dashboard shows loading skeleton on initial load (good)
- Individual task actions (complete) don't show loading state
- Button remains clickable during API call (prevented by code, but no visual feedback)

**Expected Behavior**:
- Show spinner on button during action
- Disable button during action
- Show loading state on individual task card

**Location**:
- `client/src/components/TaskList.jsx` (add loading indicator to complete button)
- Various form submission buttons

**Priority**: Medium (UX improvement)

---

### 7. Generic Error Messages

**Issue**: Error handling shows raw error messages or alerts.

**Current Behavior**:
- Uses `alert()` for errors (not user-friendly)
- Shows raw error messages from API
- No error toast notifications

**Expected Behavior**:
- User-friendly error messages
- Toast notifications for errors
- Proper error handling with fallbacks

**Location**:
- Multiple components use `alert()`
- Should implement toast notification system

**Priority**: Medium (UX improvement)

---

## Low Priority Issues

### 8. No Pagination for Tasks

**Issue**: All tasks loaded at once.

**Current Behavior**:
- Fetches all incomplete tasks
- No pagination or infinite scroll

**Expected Behavior**:
- Paginate tasks (e.g., 20 per page)
- Or implement infinite scroll

**Impact**: Low (only matters with hundreds of tasks)

**Priority**: Low (performance optimization for edge case)

---

### 9. No Pixel-Art Icons

**Issue**: PRD mentions pixel-art style icons, not implemented.

**Current Behavior**:
- Uses emoji icons (🏆, ☀️, 🌙)
- Generic styling

**Expected Behavior**:
- Custom pixel-art icons for achievements
- Pixel-art UI elements
- Retro RPG aesthetic

**Priority**: Low (visual polish, not functional)

---

### 10. Limited Tooltip Implementation

**Issue**: PRD mentions tooltips, minimal implementation.

**Current Behavior**:
- Basic HTML title attributes (if any)
- No styled tooltips

**Expected Behavior**:
- Radix Tooltip component
- Tooltips on form fields
- Tooltips on achievements

**Priority**: Low (UX improvement, not critical)

---

## Performance Issues

### 11. Multiple Profile Fetches

**Issue**: User profile fetched multiple times on auth state change.

**Current Behavior**:
- AuthContext fetches profile on session change
- Components sometimes refetch profile
- No caching

**Expected Behavior**:
- Fetch profile once on login
- Cache profile data
- Only refetch on explicit update

**Impact**: Minimal (small payload, fast queries)

**Priority**: Low (minor performance optimization)

---

### 12. Dashboard Fetches Data Sequentially on Mutations

**Issue**: After task creation/completion, entire dashboard refetches.

**Current Behavior**:
- `fetchData()` called after mutations
- Fetches tasks, achievements, labels again (even though only tasks changed)

**Expected Behavior**:
- Optimistic UI updates (partially implemented)
- Only refetch changed data
- Or use React Query/SWR for automatic caching/revalidation

**Impact**: Minor (fast API, but could be optimized)

**Priority**: Low (performance optimization)

---

## Security Considerations

### 13. Rate Limiting Not Implemented

**Issue**: No rate limiting on API endpoints.

**Current Behavior**:
- Unlimited API calls
- Potential for abuse

**Expected Behavior**:
- Rate limit by IP or user ID
- Prevent spam requests

**Priority**: Low for development, **High for production**

---

### 14. CSRF Protection Not Implemented

**Issue**: No CSRF protection.

**Current Behavior**:
- JWT-based auth (stateless)
- No CSRF tokens

**Expected Behavior**:
- For JWT auth, CSRF is less of a concern (if stored in localStorage)
- If cookies are used, need CSRF protection

**Priority**: Low (JWT in localStorage is immune to CSRF)

---

## Code Quality Issues

### 15. No Automated Tests

**Issue**: Zero test coverage.

**Current Behavior**:
- No unit tests
- No integration tests
- No E2E tests

**Expected Behavior**:
- Unit tests for services (XP, achievement)
- Integration tests for API routes
- E2E tests for critical flows (registration, task creation)

**Priority**: Low for MVP, **High for production**

---

### 16. Console Logs in Production

**Issue**: Development console.logs not removed.

**Current Behavior**:
- Many `console.log()` statements
- Some wrapped in `process.env.NODE_ENV === 'development'` (good)
- Some not wrapped

**Expected Behavior**:
- Remove all non-essential logs for production
- Use proper logging library (Winston, Pino) for backend

**Location**: Multiple files

**Priority**: Low (doesn't affect functionality, but unprofessional)

---

### 17. Inconsistent Error Handling

**Issue**: Some functions use try/catch, some don't.

**Current Behavior**:
- Some API calls have error handling
- Some silently fail or only log to console

**Expected Behavior**:
- Consistent error handling pattern
- All API calls wrapped in try/catch
- Errors reported to user

**Priority**: Low (mostly handled, but could be more consistent)

---

## Database Issues

### 18. No Database Backups Configured

**Issue**: No automated backups (Supabase default backups exist, but not verified).

**Current Behavior**:
- Relying on Supabase automatic backups
- No tested restore process

**Expected Behavior**:
- Verify Supabase backup schedule
- Test restore process
- Consider additional backup strategy for production

**Priority**: Low for development, **High for production**

---

### 19. No Database Connection Pooling Configuration

**Issue**: Relying on Supabase default connection pooling.

**Current Behavior**:
- Supabase handles connection pooling
- No custom configuration

**Expected Behavior**:
- Verify connection pool size is adequate
- Monitor connection usage
- Configure if needed

**Priority**: Low (Supabase handles this well by default)

---

## Deployment Issues (Not Yet Deployed)

### 20. No CI/CD Pipeline

**Issue**: No automated deployment process.

**Current Behavior**:
- Manual local development
- No automated builds/tests/deploys

**Expected Behavior**:
- GitHub Actions or similar
- Automated tests on PR
- Automated deployment to staging/production

**Priority**: Low for development, **Medium for production**

---

### 21. No Environment-Specific Configuration

**Issue**: Same configuration for dev and prod.

**Current Behavior**:
- Single .env file per environment
- No differentiation in code

**Expected Behavior**:
- Different configs for dev/staging/prod
- Environment-specific error handling
- Environment-specific logging

**Priority**: Low (will be set up during deployment)

---

### 22. No Monitoring/Analytics

**Issue**: No error tracking or user analytics.

**Current Behavior**:
- Errors only in console
- No crash reporting
- No usage analytics

**Expected Behavior**:
- Sentry or similar for error tracking
- Google Analytics or similar for usage
- Supabase monitoring for database

**Priority**: Low for MVP, **Medium for production**

---

## Documentation Issues

### 23. API Documentation Could Be More Detailed

**Issue**: API reference exists but could have more examples.

**Current Behavior**:
- API endpoints documented
- Request/response schemas shown
- Minimal examples

**Expected Behavior**:
- More request/response examples
- OpenAPI/Swagger spec
- Interactive API docs

**Priority**: Low (current docs are adequate)

---

### 24. No Component Storybook

**Issue**: No visual component documentation.

**Current Behavior**:
- Components documented in markdown
- No interactive component showcase

**Expected Behavior**:
- Storybook for component library
- Visual regression testing

**Priority**: Low (nice to have for larger teams)

---

## Accessibility Issues

### 25. Keyboard Navigation Could Be Improved

**Issue**: Some components not fully keyboard accessible.

**Current Behavior**:
- Basic keyboard navigation works
- Some modals/forms could be better

**Expected Behavior**:
- Full keyboard navigation
- Focus management in modals
- Escape key closes modals
- Tab order makes sense

**Priority**: Medium (important for accessibility)

---

### 26. Screen Reader Support Could Be Better

**Issue**: Minimal ARIA labels and screen reader support.

**Current Behavior**:
- Semantic HTML used (good)
- Few ARIA labels
- Not tested with screen readers

**Expected Behavior**:
- Proper ARIA labels on interactive elements
- Screen reader announcements for achievements
- Testing with screen readers

**Priority**: Medium (important for accessibility)

---

## Technical Debt

### 27. Axios vs Fetch Inconsistency

**Issue**: Frontend uses both apiClient (Axios) and Supabase client (uses fetch).

**Current Behavior**:
- apiClient for backend API
- Supabase client for database queries (some)

**Expected Behavior**:
- Consistent approach (preferably all via backend API)
- Or clearly document when to use which

**Priority**: Low (not a problem, just inconsistent)

---

### 28. Magic Numbers/Strings

**Issue**: XP values and other constants hardcoded in multiple places.

**Current Behavior**:
- XP values (100, 50, 25) in both frontend comments and backend code
- Priority strings ("High", "Medium", "Low") repeated

**Expected Behavior**:
- Constants file for XP values
- Enums or constants for priorities
- Single source of truth

**Priority**: Low (maintainability improvement)

---

## Future Feature Requests (Not Issues)

These aren't issues but features that could be added:

1. **Task due date reminders** - Email/notification for upcoming due dates
2. **Task recurrence** - Recurring tasks (daily, weekly, etc.)
3. **Task priority auto-adjustment** - Based on due date
4. **Leaderboard** - Compare XP with friends
5. **Profile customization** - Themes, avatars, etc.
6. **Export data** - Download tasks as CSV/JSON
7. **Dark/light mode auto-switch** - Based on system preference
8. **Mobile app** - React Native version
9. **Offline support** - PWA with offline capability
10. **Collaboration** - Shared tasks/lists

---

## Issue Tracking Recommendations

For production, recommend setting up issue tracking with:

- **Labels**: bug, enhancement, documentation, performance, security
- **Priority**: critical, high, medium, low
- **Status**: todo, in-progress, review, done
- **Milestones**: v1.0, v1.1, etc.

Consider using GitHub Issues, Jira, or Linear for tracking.

