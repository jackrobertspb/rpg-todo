import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import LabelIcon from './icons/LabelIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';

const TaskList = memo(function TaskList({ tasks, onComplete, onEdit, onDelete, completingTaskIds = new Set() }) {
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

  const getRarityBorder = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-l-4 border-l-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.2)] dark:shadow-[0_0_10px_rgba(250,204,21,0.15)]'; // Legendary - Gold
      case 'Medium':
        return 'border-l-4 border-l-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.15)] dark:shadow-[0_0_8px_rgba(192,132,252,0.1)]'; // Rare - Purple
      case 'Low':
        return 'border-l-4 border-l-gray-400'; // Common - Gray
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const isCompleting = completingTaskIds.has(task.id);
        return (
        <Card
          key={task.id}
          className={cn(
            "p-6",
            getRarityBorder(task.priority),
            task.is_complete && "opacity-60",
            isCompleting && "opacity-75"
          )}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative shrink-0">
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
                  "text-xl font-bold truncate",
                  "text-primary dark:text-white",
                  task.is_complete && "line-through"
                )}>
                  {task.title}
                </h3>
              </div>
              {task.description && (
                <p className={cn(
                  "mb-3 text-base leading-relaxed line-clamp-3 overflow-hidden text-ellipsis",
                  "text-gray-600 dark:text-gray-300"
                )}>
                  {task.description}
                </p>
              )}
              {task.due_date && (
                <p className={cn(
                  "text-sm mb-3",
                  "text-gray-500 dark:text-gray-400"
                )}>
                  📅 Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
              )}
              {task.task_labels && task.task_labels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.task_labels.map((tl) => (
                    <Badge key={tl.label_id} variant="default" className="flex items-center gap-1">
                      <LabelIcon className="w-3 h-3" color="white" />
                      {tl.labels?.name}
                    </Badge>
                  ))}
                </div>
              )}
              {task.is_complete && task.xp_earned > 0 && (
                <p className={cn(
                  "mt-2 text-sm font-medium",
                  "text-secondary dark:text-secondary-light"
                )}>
                  +{task.xp_earned.toLocaleString()} XP earned
                </p>
              )}
            </div>
            
            {/* Priority badge and action buttons */}
            <div className="flex items-center gap-2 flex-wrap md:shrink-0">
              {!task.is_complete && (
                <>
                  <Button
                    onClick={() => onEdit(task)}
                    variant="outline"
                    size="sm"
                    title="Edit task"
                  >
                    <EditIcon className="w-4 h-4" color="currentColor" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(task.id)}
                    variant="destructive"
                    size="sm"
                    title="Delete task"
                  >
                    <DeleteIcon className="w-4 h-4" color="white" />
                    Delete
                  </Button>
                </>
              )}
              <Badge variant={task.priority.toLowerCase()} className="w-fit h-9 flex items-center px-3 text-sm font-medium">
                {task.priority}
              </Badge>
            </div>
          </div>
        </Card>
      );
      })}
    </div>
  );
});

export default TaskList;


