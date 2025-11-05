import React, { memo } from 'react';
import { cn } from '../utils/cn';

const TaskList = memo(function TaskList({ tasks, onComplete, completingTaskIds = new Set() }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'Low':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isCompleting = completingTaskIds.has(task.id);
        return (
        <div
          key={task.id}
          className={cn(
            "p-4 rounded-lg border",
            "bg-white dark:bg-primary",
            "border-primary dark:border-primary-light",
            task.is_complete && "opacity-60 line-through",
            isCompleting && "opacity-75"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={task.is_complete || false}
                    onChange={() => !task.is_complete && !isCompleting && onComplete(task.id)}
                    className="w-5 h-5 cursor-pointer"
                    disabled={task.is_complete || isCompleting}
                  />
                  {isCompleting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-3 w-3 text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className={cn(
                  "text-lg font-bold",
                  "text-primary dark:text-white"
                )}>
                  {task.title}
                </h3>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  getPriorityColor(task.priority)
                )}>
                  {task.priority}
                </span>
              </div>
              {task.description && (
                <p className={cn(
                  "mb-2 text-sm",
                  "text-gray-700 dark:text-gray-300"
                )}>
                  {task.description}
                </p>
              )}
              {task.due_date && (
                <p className={cn(
                  "text-xs mb-2",
                  "text-gray-600 dark:text-gray-400"
                )}>
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
              )}
              {task.task_labels && task.task_labels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.task_labels.map((tl) => (
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
              )}
              {task.is_complete && task.xp_earned > 0 && (
                <p className={cn(
                  "mt-2 text-sm font-medium",
                  "text-secondary dark:text-secondary-light"
                )}>
                  +{task.xp_earned} XP earned
                </p>
              )}
            </div>
          </div>
        </div>
      );
      })}
    </div>
  );
});

export default TaskList;


