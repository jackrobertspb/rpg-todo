# TaskQuest - Complete Test Sheet

## How to Use This Sheet
- Go through each section in order
- Check ✅ for PASS, ❌ for FAIL
- Note any issues in the "Notes" column
- Test in both Light and Dark mode where applicable

---

## 1. Authentication & Registration

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Register new user | 1. Go to /register<br>2. Enter valid email, password | Account created, redirected to dashboard | ☐ | |
| Register validation | Try invalid email format | Error message shown | ☐ | |
| Register duplicate | Use existing email | Error: email already exists | ☐ | |
| Login success | Enter correct credentials | Logged in, redirected to dashboard | ☐ | |
| Login failure | Enter wrong password | Error message shown | ☐ | |
| Logout | Click Profile → Log Out | Logged out, redirected to login | ☐ | |
| Protected routes | Try accessing /dashboard while logged out | Redirected to login page | ☐ | |

---

## 2. Tutorial System (First-Time Users)

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Tutorial appears | Register new account | Tutorial modal appears automatically | ☐ | |
| Tutorial navigation | Click "Next" through steps | Progresses through 4 steps smoothly | ☐ | |
| Tutorial tooltips | Hover over form fields | Yellow tooltips appear with instructions | ☐ | |
| Tutorial completion | Click "Get Started" on step 4 | Tutorial closes, won't show again | ☐ | |
| No repeat | Logout and login again | Tutorial doesn't appear | ☐ | |

---

## 3. Task Creation

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Create basic task | 1. Click "Create New Task"<br>2. Enter title<br>3. Click Create | Task appears in list | ☐ | |
| Title required | Try to create task without title | Error: title required | ☐ | |
| Description optional | Create task with only title | Task created successfully | ☐ | |
| Priority selection | Select High/Medium/Low | Priority saved and displayed | ☐ | |
| Due date picker | Select a future date | Date saved and displayed | ☐ | |
| Label creation | 1. Click "Create New Label"<br>2. Enter name<br>3. Save | Label created and appears in dropdown | ☐ | |
| Label selection | Select 1+ labels for task | Labels appear as badges on task | ☐ | |
| Multiple labels | Add 3 different labels | All 3 display correctly | ☐ | |
| Cancel form | Click Cancel | Form closes, no task created | ☐ | |
| Field tooltips | Hover over Title, Description, Priority, Due Date | Helpful tooltips appear | ☐ | |

---

## 4. Task Management

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| View tasks | Navigate to Dashboard | All incomplete tasks visible | ☐ | |
| Complete task | Click checkbox on task | ✅ Task completion:<br>- XP animation appears<br>- Toast shows "+X XP"<br>- Progress bar updates live<br>- Task removed from list<br>- Level increases if threshold met | ☐ | |
| XP amounts | Complete tasks with different priorities | High: 100 XP<br>Medium: 50 XP<br>Low: 25 XP | ☐ | |
| Edit task | 1. Click "Edit"<br>2. Modify fields<br>3. Save | Changes reflected immediately | ☐ | |
| Delete task | Click "Delete" → Confirm | Task removed from list | ☐ | |
| Filter by label | Click a label badge in filter section | Only tasks with that label shown | ☐ | |
| Filter multiple | Select 2+ labels | Tasks with ANY selected label shown | ☐ | |
| Clear filters | Click "All Tasks" | All tasks visible again | ☐ | |
| Task rarity borders | View tasks with different priorities | High: Gold border + glow<br>Medium: Purple border + glow<br>Low: Gray border | ☐ | |
| Task hover effect | Hover over task card | Card lifts up with shadow | ☐ | |

---

## 5. XP & Leveling System

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Starting level | Create new account | Starts at Level 1, 0 XP | ☐ | |
| Progress bar | View dashboard | Progress bar shows current XP/next level | ☐ | |
| Progress bar live update | Complete a task | Progress bar fills dynamically (no refresh) | ☐ | |
| Level up | Complete enough tasks to level up | - Toast: "🎉 Level Up! You're now Level X!"<br>- Progress bar resets<br>- Dashboard shows new level | ☐ | |
| XP persistence | Logout and login | XP and level remain the same | ☐ | |
| Level cap | (If possible) Reach level 20 | Cannot exceed level 20 | ☐ | |
| Header progress bar | View in header | Mini progress bar visible | ☐ | |

---

## 6. Achievements

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| View achievements | Navigate to /achievements | All achievements visible, divided into "Earned" and "Locked" sections | ☐ | |
| Achievement categories | Check organization | Grouped: Label Master, Level Achiever, Priority Task, Task Creator | ☐ | |
| Category progression | Check order within each group | Low to high (1→2→3, Low→Med→High, 5→10→15→20) | ☐ | |
| Locked appearance | View locked achievements | Gray lock icon, 60% opacity | ☐ | |
| Earned appearance | View earned achievements | Gold trophy icon, colored background | ☐ | |
| Achievement tooltip | Hover over any achievement | Tooltip shows description and XP bonus | ☐ | |
| Earn achievement | Complete 1 task | "Task Creator 1" unlocks, toast notification appears | ☐ | |
| Achievement XP bonus | Earn achievement | Bonus XP added to total | ☐ | |
| Achievement toast | Unlock achievement | Toast shows: "Achievement Unlocked! [Name] +X XP" with trophy icon | ☐ | |
| Star icon | Check XP bonus badges | Gold star appears next to "+X XP Bonus" | ☐ | |

---

## 7. Task History

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| View history | Navigate to /history | All completed tasks shown | ☐ | |
| Completion date | Check each completed task | Shows "Completed: [date]" | ☐ | |
| Task details | View completed task | Shows title, description, priority, labels | ☐ | |
| XP earned | Check completed tasks | Shows "Earned X XP" | ☐ | |
| Empty state | Complete 0 tasks, check history | Shows message: no completed tasks | ☐ | |

---

## 8. Profile Page

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| View profile | Navigate to /profile | Shows email, level, XP, bio field, profile picture | ☐ | |
| Edit bio | 1. Enter bio text<br>2. Click Save | Success toast, bio saved | ☐ | |
| Upload profile picture | 1. Click "Choose File"<br>2. Select image<br>3. Click "Upload Picture" | Image uploads, appears immediately | ☐ | |
| Profile picture tooltip | Hover over upload button | Tooltip appears with instructions | ☐ | |
| Profile picture display | Check uploaded image | Circular, 150x150px display | ☐ | |
| Bio persistence | Logout and login | Bio text remains saved | ☐ | |
| Picture persistence | Logout and login | Profile picture remains | ☐ | |
| Invalid file type | Try to upload non-image file | Error message | ☐ | |

---

## 9. Labels Management

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Create label | In task form: Create New Label | Label created and selectable | ☐ | |
| Edit label | 1. Click edit icon next to label<br>2. Change name<br>3. Save | Label name updated everywhere | ☐ | |
| Delete label | 1. Click delete icon<br>2. Confirm | Label removed from system | ☐ | |
| Label on task | Add label to task | Badge appears on task card with label icon | ☐ | |
| Label limit | Try creating 10+ labels | All work correctly | ☐ | |
| Label icon | Check label badges | Small label icon appears next to text | ☐ | |

---

## 10. UI/UX Polish

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Dark mode toggle | Profile dropdown → toggle theme | Switches between light/dark | ☐ | |
| Dark mode persistence | Toggle dark mode, refresh page | Theme preference saved | ☐ | |
| Responsive design | Resize browser to mobile width | Layout adapts, everything readable | ☐ | |
| Navigation | Click all nav links | Dashboard, History, Achievements, Profile all work | ☐ | |
| Tooltips everywhere | Hover over icons and fields | Helpful tooltips appear | ☐ | |
| Toast notifications | Trigger various actions | Toasts appear (top-right), auto-dismiss | ☐ | |
| Icons | Check all pixel art icons | Sword (logo), Trophy, Lock, Star, Edit, Delete, Plus, Label, Profile, Moon, Sun, Shield, Check, Gem all display correctly | ☐ | |
| Typography | Check all text | Clean, readable font (not pixelated RPG font) | ☐ | |
| Spacing | Check all pages | Proper margins, padding, no overlap | ☐ | |
| Shadows | Check cards and buttons | Modern shadow effects on hover | ☐ | |
| Rounded corners | Check all UI elements | Consistent border radius | ☐ | |

---

## 11. Error Handling

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Network error | Disconnect internet, try action | Error toast appears | ☐ | |
| Invalid token | Manually clear auth token | Redirected to login | ☐ | |
| Form validation | Submit empty required fields | Inline error messages | ☐ | |
| 404 route | Navigate to /invalid-route | Redirected to dashboard or 404 page | ☐ | |

---

## 12. Performance

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Initial load | Navigate to dashboard first time | Loads within 2-3 seconds | ☐ | |
| Task completion speed | Complete a task | Updates within 1 second | ☐ | |
| No refresh needed | Complete task, check XP | XP/level updates without page refresh | ☐ | |
| Large task list | Create 20+ tasks | Page remains responsive | ☐ | |

---

## 13. Edge Cases

| Test Case | Steps | Expected Result | Pass/Fail | Notes |
|-----------|-------|-----------------|-----------|-------|
| Very long task title | Enter 200+ character title | Truncates or wraps properly | ☐ | |
| Very long description | Enter 1000+ character description | Displays properly or scrolls | ☐ | |
| Past due date | Create task with date in past | Date saves, no error | ☐ | |
| Spam task completion | Rapidly complete multiple tasks | All XP awards correctly, no duplicates | ☐ | |
| Multiple label deletes | Delete label used in many tasks | Tasks update correctly | ☐ | |
| Concurrent sessions | Login on 2 browsers | Both stay synced | ☐ | |

---

## 14. Specific PRD Requirements

| Requirement | Location in App | Verification | Pass/Fail | Notes |
|-------------|-----------------|--------------|-----------|-------|
| Priority XP values | Task completion | High:100, Med:50, Low:25 | ☐ | |
| Level cap at 20 | XP system | Cannot exceed 20 | ☐ | |
| Tutorial for new users | First login | Auto-appears once | ☐ | |
| Achievements visible from start | Achievements page | All shown (locked/earned) | ☐ | |
| Task Creator 1 (1 task) | Complete 1 task | Achievement unlocks | ☐ | |
| Task Creator 2 (5 tasks) | Complete 5 tasks | Achievement unlocks | ☐ | |
| Task Creator 3 (20 tasks) | Complete 20 tasks | Achievement unlocks | ☐ | |
| Level 5/10/15/20 Achiever | Reach those levels | Achievements unlock | ☐ | |
| Label Master 1/2/3 | Create 1/3/5 labels | Achievements unlock | ☐ | |
| Priority Task achievements | Complete High/Med/Low task | Achievements unlock | ☐ | |
| Profile picture upload | Profile page | Upload and display works | ☐ | |
| Bio field | Profile page | Save and display works | ☐ | |
| Dark/Light mode | Profile dropdown | Toggle works | ☐ | |

---

## Summary

**Total Tests:** Count all ☐ checkboxes above  
**Passed:** ___  
**Failed:** ___  
**Pass Rate:** ___% 

**Critical Issues Found:**
1. 
2. 
3. 

**Minor Issues Found:**
1. 
2. 
3. 

**Notes:**


---

## Quick Smoke Test (5 Minutes)

If you need a fast sanity check, test these critical paths:

1. ✅ Register → Login → See Dashboard
2. ✅ Create Task → Complete Task → See XP increase
3. ✅ Level up → See toast notification
4. ✅ Unlock achievement → See toast notification
5. ✅ Upload profile picture → See on profile page
6. ✅ Toggle dark mode → Theme changes
7. ✅ Create label → Use in task → Filter by label
8. ✅ View History → See completed task
9. ✅ View Achievements → See organized list
10. ✅ Logout → Login → Data persists

If all 10 pass, app is in good shape! 🎮✅

