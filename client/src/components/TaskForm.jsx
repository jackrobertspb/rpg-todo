import React, { useState, useEffect, memo, useCallback } from 'react';
import apiClient from '../api/client';
import { cn } from '../utils/cn';

const TaskForm = memo(function TaskForm({ labels, onSubmit, onCancel, initialTask = null }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'Medium');
  const [dueDate, setDueDate] = useState(
    initialTask?.due_date ? initialTask.due_date.split('T')[0] : ''
  );
  const [selectedLabels, setSelectedLabels] = useState(
    initialTask?.task_labels?.map(tl => tl.label_id) || []
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading || submitted) {
      console.warn('Form already submitting, ignoring duplicate submission');
      return;
    }

    setLoading(true);
    setSubmitted(true);

    try {
      await onSubmit({
        title,
        description,
        priority,
        due_date: dueDate || null,
        label_ids: selectedLabels,
      });
      // Success - form will be closed by parent component
    } catch (error) {
      console.error('Error submitting task:', error);
      // Reset submitted flag on error so user can retry
      setSubmitted(false);
      // Show error to user
      alert(error.response?.data?.error || error.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLabelToggle = (labelId) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  return (
    <div className={cn(
      "mb-6 p-6 rounded-lg border",
      "bg-white dark:bg-primary",
      "border-primary dark:border-primary-light",
      "shadow-lg"
    )}>
      <h3 className={cn(
        "text-xl font-rpg font-bold mb-4",
        "text-primary dark:text-white"
      )}>
        {initialTask ? 'Edit Task' : 'Create New Task'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={cn(
              "w-full px-4 py-2 rounded border",
              "border-primary dark:border-primary-light",
              "focus:outline-none focus:ring-2 focus:ring-secondary",
              "bg-white dark:bg-primary-dark",
              "text-primary dark:text-white"
            )}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={cn(
              "w-full px-4 py-2 rounded border",
              "border-primary dark:border-primary-light",
              "focus:outline-none focus:ring-2 focus:ring-secondary",
              "bg-white dark:bg-primary-dark",
              "text-primary dark:text-white"
            )}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
            Priority *
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            className={cn(
              "w-full px-4 py-2 rounded border",
              "border-primary dark:border-primary-light",
              "focus:outline-none focus:ring-2 focus:ring-secondary",
              "bg-white dark:bg-primary-dark",
              "text-primary dark:text-white"
            )}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            High: 100 XP, Medium: 50 XP, Low: 25 XP
          </p>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={cn(
              "w-full px-4 py-2 rounded border",
              "border-primary dark:border-primary-light",
              "focus:outline-none focus:ring-2 focus:ring-secondary",
              "bg-white dark:bg-primary-dark",
              "text-primary dark:text-white"
            )}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-primary dark:text-white">
            Labels
          </label>
          {labels.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              No labels available. Labels will appear here once you have some.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <label
                  key={label.id}
                  className={cn(
                    "px-3 py-1 rounded cursor-pointer border transition-colors",
                    selectedLabels.includes(label.id)
                      ? "bg-secondary text-white border-secondary"
                      : "bg-white dark:bg-primary-dark text-primary dark:text-white border-primary hover:border-secondary"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedLabels.includes(label.id)}
                    onChange={() => handleLabelToggle(label.id)}
                    className="hidden"
                  />
                  {label.name}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || submitted}
            className={cn(
              "px-6 py-2 rounded font-medium flex items-center gap-2",
              "bg-secondary hover:bg-secondary-light",
              "text-white transition-colors",
              "disabled:opacity-50 disabled:cursor-wait"
            )}
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Saving...' : initialTask ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "px-6 py-2 rounded font-medium border",
              "border-primary dark:border-primary-light",
              "text-primary dark:text-white",
              "hover:bg-gray-100 dark:hover:bg-primary-light"
            )}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
});

export default TaskForm;


