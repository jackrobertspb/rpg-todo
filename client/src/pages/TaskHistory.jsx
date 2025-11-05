import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { cn } from '../utils/cn';

export default function TaskHistory() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get('/tasks/history');
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching task history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

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
          Task Completion History
        </h1>
        {tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-4 rounded-lg border",
                  "bg-white dark:bg-primary",
                  "border-primary dark:border-primary-light"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-lg font-bold mb-2",
                      "text-primary dark:text-white"
                    )}>
                      {task.title}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Completed</p>
                        <p className={cn(
                          "font-medium",
                          "text-primary dark:text-white"
                        )}>
                          {task.completed_at
                            ? new Date(task.completed_at).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Priority</p>
                        <p className={cn(
                          "font-medium",
                          "text-primary dark:text-white"
                        )}>
                          {task.priority}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">XP Earned</p>
                        <p className={cn(
                          "font-medium text-secondary dark:text-secondary-light"
                        )}>
                          {task.xp_earned} XP
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Labels</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.task_labels?.map((tl) => (
                            <span
                              key={tl.label_id}
                              className={cn(
                                "px-2 py-1 rounded text-xs",
                                "bg-secondary dark:bg-secondary-dark",
                                "text-white"
                              )}
                            >
                              {tl.labels?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={cn(
            "text-lg",
            "text-primary dark:text-white"
          )}>
            No completed tasks yet. Complete some tasks to see your history here!
          </p>
        )}
      </div>
    </div>
  );
}


