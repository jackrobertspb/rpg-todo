import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ConfirmModal from '../components/ConfirmModal';

export default function TestSheet() {
  const [testResults, setTestResults] = useState(() => {
    const saved = localStorage.getItem('testResults');
    return saved ? JSON.parse(saved) : {};
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('testNotes');
    return saved ? JSON.parse(saved) : {};
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('testResults', JSON.stringify(testResults));
  }, [testResults]);

  useEffect(() => {
    localStorage.setItem('testNotes', JSON.stringify(notes));
  }, [notes]);

  const toggleTest = (testId) => {
    setTestResults(prev => ({
      ...prev,
      [testId]: prev[testId] === 'pass' ? 'fail' : prev[testId] === 'fail' ? undefined : 'pass'
    }));
  };

  const updateNote = (testId, note) => {
    setNotes(prev => ({ ...prev, [testId]: note }));
  };

  const resetAll = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setTestResults({});
    setNotes({});
  };

  const testSections = [
    {
      title: '1. Authentication & Registration',
      tests: [
        { id: 'auth-1', name: 'Register new user', steps: '1. Go to /register\n2. Enter valid email, password', expected: 'Account created, redirected to dashboard' },
        { id: 'auth-2', name: 'Register validation', steps: 'Try invalid email format', expected: 'Error message shown' },
        { id: 'auth-3', name: 'Register duplicate', steps: 'Use existing email', expected: 'Error: email already exists' },
        { id: 'auth-4', name: 'Login success', steps: 'Enter correct credentials', expected: 'Logged in, redirected to dashboard' },
        { id: 'auth-5', name: 'Login failure', steps: 'Enter wrong password', expected: 'Error message shown' },
        { id: 'auth-6', name: 'Logout', steps: 'Click Profile → Log Out', expected: 'Logged out, redirected to login' },
        { id: 'auth-7', name: 'Protected routes', steps: 'Try accessing /dashboard while logged out', expected: 'Redirected to login page' },
      ]
    },
    {
      title: '2. Tutorial System',
      tests: [
        { id: 'tut-1', name: 'Tutorial appears', steps: 'Register new account', expected: 'Tutorial modal appears automatically' },
        { id: 'tut-2', name: 'Tutorial navigation', steps: 'Click "Next" through steps', expected: 'Progresses through 4 steps smoothly' },
        { id: 'tut-3', name: 'Tutorial tooltips', steps: 'Hover over form fields', expected: 'Yellow tooltips appear with instructions' },
        { id: 'tut-4', name: 'Tutorial completion', steps: 'Click "Get Started" on step 4', expected: 'Tutorial closes, won\'t show again' },
        { id: 'tut-5', name: 'No repeat', steps: 'Logout and login again', expected: 'Tutorial doesn\'t appear' },
      ]
    },
    {
      title: '3. Task Creation',
      tests: [
        { id: 'task-1', name: 'Create basic task', steps: '1. Click "Create New Task"\n2. Enter title\n3. Click Create', expected: 'Task appears in list' },
        { id: 'task-2', name: 'Title required', steps: 'Try to create task without title', expected: 'Error: title required' },
        { id: 'task-3', name: 'Description optional', steps: 'Create task with only title', expected: 'Task created successfully' },
        { id: 'task-4', name: 'Priority selection', steps: 'Select High/Medium/Low', expected: 'Priority saved and displayed' },
        { id: 'task-5', name: 'Due date picker', steps: 'Select a future date', expected: 'Date saved and displayed' },
        { id: 'task-6', name: 'Label creation', steps: '1. Click "Create New Label"\n2. Enter name\n3. Save', expected: 'Label created and appears in dropdown' },
        { id: 'task-7', name: 'Label selection', steps: 'Select 1+ labels for task', expected: 'Labels appear as badges on task' },
        { id: 'task-8', name: 'Multiple labels', steps: 'Add 3 different labels', expected: 'All 3 display correctly' },
        { id: 'task-9', name: 'Cancel form', steps: 'Click Cancel', expected: 'Form closes, no task created' },
        { id: 'task-10', name: 'Field tooltips', steps: 'Hover over Title, Description, Priority, Due Date', expected: 'Helpful tooltips appear' },
      ]
    },
    {
      title: '4. Task Management',
      tests: [
        { id: 'mgmt-1', name: 'View tasks', steps: 'Navigate to Dashboard', expected: 'All incomplete tasks visible' },
        { id: 'mgmt-2', name: 'Complete task', steps: 'Click checkbox on task', expected: '✅ XP animation, toast, progress bar updates live, task removed, level up if threshold met' },
        { id: 'mgmt-3', name: 'XP amounts', steps: 'Complete tasks with different priorities', expected: 'High: 100 XP, Medium: 50 XP, Low: 25 XP' },
        { id: 'mgmt-4', name: 'Edit task', steps: '1. Click "Edit"\n2. Modify fields\n3. Save', expected: 'Changes reflected immediately' },
        { id: 'mgmt-5', name: 'Delete task', steps: 'Click "Delete" → Confirm', expected: 'Task removed from list' },
        { id: 'mgmt-6', name: 'Filter by label', steps: 'Click a label badge in filter section', expected: 'Only tasks with that label shown' },
        { id: 'mgmt-7', name: 'Filter multiple', steps: 'Select 2+ labels', expected: 'Tasks with ANY selected label shown' },
        { id: 'mgmt-8', name: 'Clear filters', steps: 'Click "All Tasks"', expected: 'All tasks visible again' },
        { id: 'mgmt-9', name: 'Task rarity borders', steps: 'View tasks with different priorities', expected: 'High: Gold border + glow, Medium: Purple border + glow, Low: Gray border' },
        { id: 'mgmt-10', name: 'Task hover effect', steps: 'Hover over task card', expected: 'Card lifts up with shadow' },
      ]
    },
    {
      title: '5. XP & Leveling System',
      tests: [
        { id: 'xp-1', name: 'Starting level', steps: 'Create new account', expected: 'Starts at Level 1, 0 XP' },
        { id: 'xp-2', name: 'Progress bar', steps: 'View dashboard', expected: 'Progress bar shows current XP/next level' },
        { id: 'xp-3', name: 'Progress bar live update', steps: 'Complete a task', expected: 'Progress bar fills dynamically (no refresh)' },
        { id: 'xp-4', name: 'Level up', steps: 'Complete enough tasks to level up', expected: 'Toast: "🎉 Level Up!", progress bar resets, dashboard shows new level' },
        { id: 'xp-5', name: 'XP persistence', steps: 'Logout and login', expected: 'XP and level remain the same' },
        { id: 'xp-6', name: 'Level cap', steps: 'Reach level 20', expected: 'Cannot exceed level 20' },
        { id: 'xp-7', name: 'Header progress bar', steps: 'View in header', expected: 'Mini progress bar visible' },
      ]
    },
    {
      title: '6. Achievements',
      tests: [
        { id: 'ach-1', name: 'View achievements', steps: 'Navigate to /achievements', expected: 'All achievements visible, divided into "Earned" and "Locked" sections' },
        { id: 'ach-2', name: 'Achievement categories', steps: 'Check organization', expected: 'Grouped: Label Master, Level Achiever, Priority Task, Task Creator' },
        { id: 'ach-3', name: 'Category progression', steps: 'Check order within each group', expected: 'Low to high (1→2→3, Low→Med→High, 5→10→15→20)' },
        { id: 'ach-4', name: 'Locked appearance', steps: 'View locked achievements', expected: 'Gray lock icon, 60% opacity' },
        { id: 'ach-5', name: 'Earned appearance', steps: 'View earned achievements', expected: 'Gold trophy icon, colored background' },
        { id: 'ach-6', name: 'Achievement tooltip', steps: 'Hover over any achievement', expected: 'Tooltip shows description and XP bonus' },
        { id: 'ach-7', name: 'Earn achievement', steps: 'Complete 1 task', expected: '"Task Creator 1" unlocks, toast notification appears' },
        { id: 'ach-8', name: 'Achievement XP bonus', steps: 'Earn achievement', expected: 'Bonus XP added to total' },
        { id: 'ach-9', name: 'Achievement toast', steps: 'Unlock achievement', expected: 'Toast shows: "Achievement Unlocked! [Name] +X XP" with trophy icon' },
        { id: 'ach-10', name: 'Star icon', steps: 'Check XP bonus badges', expected: 'Gold star appears next to "+X XP Bonus"' },
      ]
    },
    {
      title: '7. Task History',
      tests: [
        { id: 'hist-1', name: 'View history', steps: 'Navigate to /history', expected: 'All completed tasks shown' },
        { id: 'hist-2', name: 'Completion date', steps: 'Check each completed task', expected: 'Shows "Completed: [date]"' },
        { id: 'hist-3', name: 'Task details', steps: 'View completed task', expected: 'Shows title, description, priority, labels' },
        { id: 'hist-4', name: 'XP earned', steps: 'Check completed tasks', expected: 'Shows "Earned X XP"' },
        { id: 'hist-5', name: 'Empty state', steps: 'Complete 0 tasks, check history', expected: 'Shows message: no completed tasks' },
      ]
    },
    {
      title: '8. Profile Page',
      tests: [
        { id: 'prof-1', name: 'View profile', steps: 'Navigate to /profile', expected: 'Shows email, level, XP, bio field, profile picture' },
        { id: 'prof-2', name: 'Edit bio', steps: '1. Enter bio text\n2. Click Save', expected: 'Success toast, bio saved' },
        { id: 'prof-3', name: 'Upload profile picture', steps: '1. Click "Choose File"\n2. Select image\n3. Click "Upload Picture"', expected: 'Image uploads, appears immediately' },
        { id: 'prof-4', name: 'Profile picture tooltip', steps: 'Hover over upload button', expected: 'Tooltip appears with instructions' },
        { id: 'prof-5', name: 'Profile picture display', steps: 'Check uploaded image', expected: 'Circular, 150x150px display' },
        { id: 'prof-6', name: 'Bio persistence', steps: 'Logout and login', expected: 'Bio text remains saved' },
        { id: 'prof-7', name: 'Picture persistence', steps: 'Logout and login', expected: 'Profile picture remains' },
        { id: 'prof-8', name: 'Invalid file type', steps: 'Try to upload non-image file', expected: 'Error message' },
      ]
    },
    {
      title: '9. Labels Management',
      tests: [
        { id: 'label-1', name: 'Create label', steps: 'In task form: Create New Label', expected: 'Label created and selectable' },
        { id: 'label-2', name: 'Edit label', steps: '1. Click edit icon\n2. Change name\n3. Save', expected: 'Label name updated everywhere' },
        { id: 'label-3', name: 'Delete label', steps: '1. Click delete icon\n2. Confirm', expected: 'Label removed from system' },
        { id: 'label-4', name: 'Label on task', steps: 'Add label to task', expected: 'Badge appears on task card with label icon' },
        { id: 'label-5', name: 'Label limit', steps: 'Try creating 10+ labels', expected: 'All work correctly' },
        { id: 'label-6', name: 'Label icon', steps: 'Check label badges', expected: 'Small label icon appears next to text' },
      ]
    },
    {
      title: '10. UI/UX Polish',
      tests: [
        { id: 'ui-1', name: 'Dark mode toggle', steps: 'Profile dropdown → toggle theme', expected: 'Switches between light/dark' },
        { id: 'ui-2', name: 'Dark mode persistence', steps: 'Toggle dark mode, refresh page', expected: 'Theme preference saved' },
        { id: 'ui-3', name: 'Responsive design', steps: 'Resize browser to mobile width', expected: 'Layout adapts, everything readable' },
        { id: 'ui-4', name: 'Navigation', steps: 'Click all nav links', expected: 'Dashboard, History, Achievements, Profile all work' },
        { id: 'ui-5', name: 'Tooltips everywhere', steps: 'Hover over icons and fields', expected: 'Helpful tooltips appear' },
        { id: 'ui-6', name: 'Toast notifications', steps: 'Trigger various actions', expected: 'Toasts appear (top-right), auto-dismiss' },
        { id: 'ui-7', name: 'Icons', steps: 'Check all pixel art icons', expected: 'Sword, Trophy, Lock, Star, Edit, Delete, Plus, Label, Profile, Moon, Sun all display correctly' },
        { id: 'ui-8', name: 'Typography', steps: 'Check all text', expected: 'Clean, readable font (not pixelated RPG font)' },
        { id: 'ui-9', name: 'Spacing', steps: 'Check all pages', expected: 'Proper margins, padding, no overlap' },
        { id: 'ui-10', name: 'Shadows', steps: 'Check cards and buttons', expected: 'Modern shadow effects on hover' },
        { id: 'ui-11', name: 'Rounded corners', steps: 'Check all UI elements', expected: 'Consistent border radius' },
      ]
    },
    {
      title: '11. Error Handling',
      tests: [
        { id: 'err-1', name: 'Network error', steps: 'Disconnect internet, try action', expected: 'Error toast appears' },
        { id: 'err-2', name: 'Invalid token', steps: 'Manually clear auth token', expected: 'Redirected to login' },
        { id: 'err-3', name: 'Form validation', steps: 'Submit empty required fields', expected: 'Inline error messages' },
        { id: 'err-4', name: '404 route', steps: 'Navigate to /invalid-route', expected: 'Redirected to dashboard or 404 page' },
      ]
    },
    {
      title: '12. Performance',
      tests: [
        { id: 'perf-1', name: 'Initial load', steps: 'Navigate to dashboard first time', expected: 'Loads within 2-3 seconds' },
        { id: 'perf-2', name: 'Task completion speed', steps: 'Complete a task', expected: 'Updates within 1 second' },
        { id: 'perf-3', name: 'No refresh needed', steps: 'Complete task, check XP', expected: 'XP/level updates without page refresh' },
        { id: 'perf-4', name: 'Large task list', steps: 'Create 20+ tasks', expected: 'Page remains responsive' },
      ]
    },
    {
      title: '13. Edge Cases',
      tests: [
        { id: 'edge-1', name: 'Very long task title', steps: 'Enter 200+ character title', expected: 'Truncates or wraps properly' },
        { id: 'edge-2', name: 'Very long description', steps: 'Enter 1000+ character description', expected: 'Displays properly or scrolls' },
        { id: 'edge-3', name: 'Past due date', steps: 'Create task with date in past', expected: 'Date saves, no error' },
        { id: 'edge-4', name: 'Spam task completion', steps: 'Rapidly complete multiple tasks', expected: 'All XP awards correctly, no duplicates' },
        { id: 'edge-5', name: 'Multiple label deletes', steps: 'Delete label used in many tasks', expected: 'Tasks update correctly' },
        { id: 'edge-6', name: 'Concurrent sessions', steps: 'Login on 2 browsers', expected: 'Both stay synced' },
      ]
    },
    {
      title: '14. Specific PRD Requirements',
      tests: [
        { id: 'prd-1', name: 'Priority XP values', steps: 'Task completion', expected: 'High:100, Med:50, Low:25' },
        { id: 'prd-2', name: 'Level cap at 20', steps: 'XP system', expected: 'Cannot exceed 20' },
        { id: 'prd-3', name: 'Tutorial for new users', steps: 'First login', expected: 'Auto-appears once' },
        { id: 'prd-4', name: 'Achievements visible from start', steps: 'Achievements page', expected: 'All shown (locked/earned)' },
        { id: 'prd-5', name: 'Task Creator 1 (1 task)', steps: 'Complete 1 task', expected: 'Achievement unlocks' },
        { id: 'prd-6', name: 'Task Creator 2 (5 tasks)', steps: 'Complete 5 tasks', expected: 'Achievement unlocks' },
        { id: 'prd-7', name: 'Task Creator 3 (20 tasks)', steps: 'Complete 20 tasks', expected: 'Achievement unlocks' },
        { id: 'prd-8', name: 'Level 5/10/15/20 Achiever', steps: 'Reach those levels', expected: 'Achievements unlock' },
        { id: 'prd-9', name: 'Label Master 1/2/3', steps: 'Create 1/3/5 labels', expected: 'Achievements unlock' },
        { id: 'prd-10', name: 'Priority Task achievements', steps: 'Complete High/Med/Low task', expected: 'Achievements unlock' },
        { id: 'prd-11', name: 'Profile picture upload', steps: 'Profile page', expected: 'Upload and display works' },
        { id: 'prd-12', name: 'Bio field', steps: 'Profile page', expected: 'Save and display works' },
        { id: 'prd-13', name: 'Dark/Light mode', steps: 'Profile dropdown', expected: 'Toggle works' },
      ]
    },
  ];

  const allTests = testSections.flatMap(section => section.tests);
  const totalTests = allTests.length;
  const passedTests = Object.values(testResults).filter(r => r === 'pass').length;
  const failedTests = Object.values(testResults).filter(r => r === 'fail').length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className={cn(
      "min-h-screen pb-20",
      "bg-white dark:bg-primary-dark"
    )}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className={cn(
            "text-4xl font-sans font-bold",
            "text-primary dark:text-white"
          )}>
            🧪 Test Sheet
          </h1>
          <button
            onClick={resetAll}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            Reset All
          </button>
        </div>

        {/* Summary Stats */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary to-primary-light dark:from-primary-light dark:to-primary text-white">
          <h2 className="text-2xl font-bold mb-4">Test Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm opacity-90">Total Tests</p>
              <p className="text-3xl font-bold">{totalTests}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90">Passed</p>
              <p className="text-3xl font-bold text-green-300">{passedTests}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90">Failed</p>
              <p className="text-3xl font-bold text-red-300">{failedTests}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90">Pass Rate</p>
              <p className="text-3xl font-bold">{passRate}%</p>
            </div>
          </div>
        </Card>

        {/* Test Sections */}
        <div className="space-y-8">
          {testSections.map((section, sectionIdx) => {
            const sectionPassed = section.tests.filter(t => testResults[t.id] === 'pass').length;
            const sectionTotal = section.tests.length;
            
            return (
              <div key={sectionIdx}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={cn(
                    "text-2xl font-sans font-bold",
                    "text-primary dark:text-white"
                  )}>
                    {section.title}
                  </h2>
                  <Badge variant="outline" className="text-sm">
                    {sectionPassed}/{sectionTotal} passed
                  </Badge>
                </div>

                <div className="space-y-4">
                  {section.tests.map((test) => {
                    const status = testResults[test.id];
                    const note = notes[test.id] || '';

                    return (
                      <Card
                        key={test.id}
                        className={cn(
                          "p-4 transition-all",
                          status === 'pass' && "border-green-500 bg-green-50 dark:bg-green-950",
                          status === 'fail' && "border-red-500 bg-red-50 dark:bg-red-950"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleTest(test.id)}
                            className={cn(
                              "w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all mt-1",
                              status === 'pass' && "bg-green-500 border-green-500",
                              status === 'fail' && "bg-red-500 border-red-500",
                              !status && "border-gray-300 dark:border-gray-600 hover:border-primary"
                            )}
                          >
                            {status === 'pass' && <span className="text-white text-sm">✓</span>}
                            {status === 'fail' && <span className="text-white text-sm">✗</span>}
                          </button>

                          {/* Test Details */}
                          <div className="flex-1">
                            <h3 className={cn(
                              "font-bold text-lg mb-2",
                              "text-primary dark:text-white"
                            )}>
                              {test.name}
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Steps:</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {test.steps}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Expected Result:</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {test.expected}
                                </p>
                              </div>
                            </div>

                            {/* Notes Input */}
                            <input
                              type="text"
                              placeholder="Add notes..."
                              value={note}
                              onChange={(e) => updateNote(test.id, e.target.value)}
                              className={cn(
                                "w-full px-3 py-2 text-sm rounded border",
                                "bg-white dark:bg-primary-dark",
                                "border-gray-300 dark:border-gray-600",
                                "text-primary dark:text-white",
                                "placeholder-gray-400 dark:placeholder-gray-500",
                                "focus:outline-none focus:ring-2 focus:ring-primary"
                              )}
                            />
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Smoke Test */}
        <Card className="p-6 mt-8 bg-yellow-50 dark:bg-yellow-950 border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">
            ⚡ Quick Smoke Test (5 Minutes)
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            If you need a fast sanity check, test these critical paths:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>Register → Login → See Dashboard</li>
            <li>Create Task → Complete Task → See XP increase</li>
            <li>Level up → See toast notification</li>
            <li>Unlock achievement → See toast notification</li>
            <li>Upload profile picture → See on profile page</li>
            <li>Toggle dark mode → Theme changes</li>
            <li>Create label → Use in task → Filter by label</li>
            <li>View History → See completed task</li>
            <li>View Achievements → See organized list</li>
            <li>Logout → Login → Data persists</li>
          </ol>
          <p className="text-sm font-bold text-primary dark:text-white mt-4">
            If all 10 pass, app is in good shape! 🎮✅
          </p>
        </Card>
      </div>
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="Reset All Tests?"
        message="Are you sure you want to reset all test results and notes? This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

