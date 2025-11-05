import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import ProgressBar from '../components/ProgressBar';
import { cn } from '../utils/cn';
import Tutorial from '../components/Tutorial';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [filterLabelIds, setFilterLabelIds] = useState([]);
  const [labels, setLabels] = useState([]);
  const [completingTaskIds, setCompletingTaskIds] = useState(new Set()); // Track tasks being completed

  // Debug logging - only in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Dashboard mounted, user:', user);
      console.log('Dashboard loading state:', loading);
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('User exists, calling fetchData');
      }
      fetchData();
      checkTutorial();
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('No user, stopping loading');
      }
      // If no user, stop loading after a short delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // fetchData is stable, only re-run when user ID changes

  // Safety timeout - if loading takes more than 3 seconds, stop loading
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.warn('Dashboard loading timeout - forcing stop after 3 seconds');
        setLoading(false);
      }, 3000); // Reduced to 3 seconds
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  const checkTutorial = () => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted && user) {
      setShowTutorial(true);
    }
  };

  const fetchData = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('fetchData called, user:', user?.id);
    }
    try {
      setLoading(true);
      
      // Fetch all data in parallel instead of sequentially
      const [tasksRes, achievementsRes, labelsRes] = await Promise.allSettled([
        apiClient.get('/tasks', { params: { is_complete: false } }),
        apiClient.get('/achievements/earned'),
        apiClient.get('/labels')
      ]);

      // Handle tasks
      if (tasksRes.status === 'fulfilled') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Tasks fetched:', tasksRes.value.data);
        }
        setTasks(tasksRes.value.data.tasks || []);
      } else {
        console.error('Error fetching tasks:', tasksRes.reason);
        setTasks([]);
      }

      // Handle achievements
      if (achievementsRes.status === 'fulfilled') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Achievements fetched:', achievementsRes.value.data);
        }
        setAchievements(achievementsRes.value.data.achievements || []);
      } else {
        console.error('Error fetching achievements:', achievementsRes.reason);
        setAchievements([]);
      }

      // Handle labels
      if (labelsRes.status === 'fulfilled') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Labels fetched:', labelsRes.value.data);
        }
        setLabels(labelsRes.value.data.labels || []);
      } else {
        console.error('Error fetching labels:', labelsRes.reason);
        setLabels([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      if (process.env.NODE_ENV === 'development') {
        console.log('fetchData complete, setting loading to false');
      }
      setLoading(false);
    }
  }, [user?.id]);

  const handleTaskComplete = useCallback(async (taskId) => {
    // Prevent multiple clicks
    if (completingTaskIds.has(taskId)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Task already being completed, ignoring duplicate click');
      }
      return;
    }

    // Optimistically update UI
    setCompletingTaskIds(prev => new Set(prev).add(taskId));
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, is_complete: true } : task
      )
    );

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Completing task:', taskId);
      }
      const response = await apiClient.post(`/tasks/${taskId}/complete`);
      if (process.env.NODE_ENV === 'development') {
        console.log('Task completed successfully:', response.data);
      }
      
      // Refresh data to get updated XP and achievements
      await fetchData();
      
      // Show achievement notifications if any earned
      if (response.data.new_achievements?.length > 0) {
        response.data.new_achievements.forEach(achievement => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Achievement earned:', achievement.name);
          }
          // TODO: Show toast notification
        });
      }

      // Refresh user data for XP/level updates
      const { data: profile } = await apiClient.get('/profile');
      // Update user context would happen here
    } catch (error) {
      console.error('Error completing task:', error);
      // Revert optimistic update on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, is_complete: false } : task
        )
      );
      alert(error.response?.data?.error || 'Failed to complete task. Please try again.');
    } finally {
      // Remove from completing set
      setCompletingTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  }, [completingTaskIds, fetchData]);

  const handleTaskCreate = useCallback(async (taskData) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Creating task:', taskData);
      }
      const response = await apiClient.post('/tasks', taskData);
      if (process.env.NODE_ENV === 'development') {
        console.log('Task created successfully:', response.data);
      }
      
      await fetchData();
      setShowTaskForm(false);

      // Show achievement notifications if any earned
      if (response.data.new_achievements?.length > 0) {
        response.data.new_achievements.forEach(achievement => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Achievement earned:', achievement.name);
          }
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create task. Please try again.';
      alert(errorMessage);
      throw error; // Re-throw so TaskForm can handle it
    }
  }, [fetchData]);

  const handleFilterChange = useCallback((labelIds) => {
    setFilterLabelIds(labelIds);
  }, []);

  const filteredTasks = useMemo(() => {
    if (filterLabelIds.length === 0) return tasks;
    return tasks.filter(task => {
      const taskLabelIds = task.task_labels?.map(tl => tl.label_id) || [];
      return filterLabelIds.some(id => taskLabelIds.includes(id));
    });
  }, [tasks, filterLabelIds]);

  // Sort by priority (High, Medium, Low)
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [filteredTasks]);

  if (loading) {
    return (
      <div className={cn(
        "min-h-screen",
        "bg-white dark:bg-primary-dark"
      )}>
        <div className="container mx-auto px-4 py-8">
          <h1 className={cn(
            "text-3xl font-rpg font-bold mb-6",
            "text-primary dark:text-white"
          )}>
            Dashboard
          </h1>
          
          {/* Profile Summary Skeleton */}
          <div className={cn(
            "mb-6 p-6 rounded-lg animate-pulse",
            "bg-primary dark:bg-primary-light",
            "h-32"
          )}></div>

          {/* Task List Skeleton */}
          <div className="space-y-4">
            <div className={cn(
              "p-4 rounded-lg border animate-pulse",
              "bg-white dark:bg-primary",
              "border-primary dark:border-primary-light",
              "h-20"
            )}></div>
            <div className={cn(
              "p-4 rounded-lg border animate-pulse",
              "bg-white dark:bg-primary",
              "border-primary dark:border-primary-light",
              "h-20"
            )}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-white dark:bg-primary-dark"
      )}>
        <div className="text-center">
          <div className="text-xl font-rpg text-primary dark:text-white mb-4">Please log in</div>
          <button
            onClick={() => navigate('/login')}
            className={cn(
              "px-6 py-2 rounded font-medium",
              "bg-secondary hover:bg-secondary-light",
              "text-white transition-colors"
            )}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen",
      "bg-white dark:bg-primary-dark"
    )}>
      {showTutorial && (
        <Tutorial onComplete={() => {
          setShowTutorial(false);
          localStorage.setItem('tutorialCompleted', 'true');
        }} />
      )}
      <div className="container mx-auto px-4 py-8">
        <h1 className={cn(
          "text-3xl font-rpg font-bold mb-6",
          "text-primary dark:text-white"
        )}>
          Dashboard
        </h1>

        {/* Profile Summary */}
        <div className={cn(
          "mb-6 p-6 rounded-lg",
          "bg-primary dark:bg-primary-light",
          "text-white"
        )}>
          <h2 className="text-xl font-rpg font-bold mb-4">Progress</h2>
          <div className="mb-4">
            <ProgressBar
              currentXP={user?.total_xp || 0}
              currentLevel={user?.current_level || 1}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-80">Current Level</p>
              <p className="text-2xl font-bold">{user?.current_level || 1}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Total XP</p>
              <p className="text-2xl font-bold">{user?.total_xp || 0}</p>
            </div>
          </div>
        </div>

        {/* Achievements Summary */}
        {achievements.length > 0 && (
          <div className={cn(
            "mb-6 p-6 rounded-lg",
            "bg-secondary dark:bg-secondary-dark",
            "text-white"
          )}>
            <h2 className="text-xl font-rpg font-bold mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.slice(0, 4).map((ua) => (
                <div key={ua.achievements.id} className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <p className="text-sm font-medium">{ua.achievements.name}</p>
                </div>
              ))}
            </div>
            {achievements.length > 4 && (
              <button
                onClick={() => navigate('/achievements')}
                className={cn(
                  "mt-4 text-sm underline",
                  "hover:text-secondary-light"
                )}
              >
                View all achievements
              </button>
            )}
          </div>
        )}

        {/* Task Creation */}
        <div className="mb-6">
          <button
            onClick={() => setShowTaskForm(true)}
            className={cn(
              "px-6 py-3 rounded font-medium",
              "bg-secondary hover:bg-secondary-light",
              "text-white transition-colors"
            )}
          >
            Create New Task
          </button>
        </div>

        {showTaskForm && (
          <TaskForm
            labels={labels}
            onSubmit={handleTaskCreate}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        {/* Task Filtering */}
        {labels.length > 0 && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
              Filter by Labels:
            </label>
            <select
              multiple
              value={filterLabelIds}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange(selected);
              }}
              className={cn(
                "w-full md:w-64 px-4 py-2 rounded border",
                "border-primary dark:border-primary-light",
                "bg-white dark:bg-primary-dark",
                "text-primary dark:text-white"
              )}
            >
              {labels.map((label) => (
                <option key={label.id} value={label.id}>
                  {label.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Prioritized Task List */}
        <div>
          <h2 className={cn(
            "text-2xl font-rpg font-bold mb-4",
            "text-primary dark:text-white"
          )}>
            Incomplete Tasks
          </h2>
          {sortedTasks.length > 0 ? (
            <TaskList
              tasks={sortedTasks}
              onComplete={handleTaskComplete}
              completingTaskIds={completingTaskIds}
            />
          ) : (
            <p className="text-primary dark:text-white">
              No tasks yet. Create your first task to get started!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


