import React, { useState, useEffect, memo, useCallback } from 'react';
import toast from 'react-hot-toast';
import apiClient from '../api/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Tooltip from './Tooltip';
import ConfirmModal from './ConfirmModal';

const TaskForm = memo(function TaskForm({ labels, onSubmit, onCancel, initialTask = null, onLabelsChange }) {
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
  
  // Label management state
  const [showLabelManagement, setShowLabelManagement] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [editingLabel, setEditingLabel] = useState(null);
  const [editLabelName, setEditLabelName] = useState('');
  const [deleteLabelConfirm, setDeleteLabelConfirm] = useState(null); // { labelId, labelName }

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
      // Error is already shown by Dashboard via toast
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

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) {
      toast.error('Label name cannot be empty');
      return;
    }

    try {
      await apiClient.post('/labels', { name: newLabelName.trim() });
      setNewLabelName('');
      toast.success('Label created!');
      if (onLabelsChange) await onLabelsChange();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create label');
    }
  };

  const handleUpdateLabel = async (labelId) => {
    if (!editLabelName.trim()) {
      toast.error('Label name cannot be empty');
      return;
    }

    try {
      await apiClient.put(`/labels/${labelId}`, { name: editLabelName.trim() });
      setEditingLabel(null);
      setEditLabelName('');
      toast.success('Label updated!');
      if (onLabelsChange) await onLabelsChange();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update label');
    }
  };

  const handleDeleteLabel = (labelId) => {
    const label = labels.find(l => l.id === labelId);
    setDeleteLabelConfirm({
      labelId,
      labelName: label?.name || 'this label'
    });
  };

  const confirmDeleteLabel = async () => {
    if (!deleteLabelConfirm) return;

    try {
      await apiClient.delete(`/labels/${deleteLabelConfirm.labelId}`);
      setSelectedLabels(prev => prev.filter(id => id !== deleteLabelConfirm.labelId));
      toast.success('Label deleted!');
      if (onLabelsChange) await onLabelsChange();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete label');
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-sans">
          {initialTask ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Tooltip content="Enter a short, descriptive title for your task" position="top">
            <Label>Title * ℹ️</Label>
          </Tooltip>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Complete project report"
          />
        </div>
        <div>
          <Tooltip content="Add additional details about your task (optional)" position="top">
            <Label>Description ℹ️</Label>
          </Tooltip>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g., Need to finalize the Q4 report with charts and submit by Friday"
          />
        </div>
        <div>
          <Tooltip content="Set task priority - higher priority tasks earn more XP when completed" position="top">
            <Label>Priority * ℹ️</Label>
          </Tooltip>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            High: 100 XP, Medium: 50 XP, Low: 25 XP
          </p>
        </div>
        <div>
          <Tooltip content="Set a deadline for this task (optional)" position="top">
            <Label>Due Date ℹ️</Label>
          </Tooltip>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Tooltip content="Select labels to organize your task - you can select multiple labels" position="top">
              <label className="text-sm font-medium text-primary dark:text-white cursor-help">
                Labels ℹ️
              </label>
            </Tooltip>
            <button
              type="button"
              onClick={() => setShowLabelManagement(!showLabelManagement)}
              className="text-xs text-secondary hover:underline"
            >
              {showLabelManagement ? 'Hide' : 'Manage Labels'}
            </button>
          </div>
          
          {showLabelManagement && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-primary-dark rounded border border-gray-300 dark:border-primary-light">
              {/* Create New Label */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-primary dark:text-white mb-1">
                  Create New Label
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="Label name"
                    className={cn(
                      "flex-1 px-3 py-1 text-sm rounded border",
                      "border-primary dark:border-primary-light",
                      "bg-white dark:bg-primary-dark",
                      "text-primary dark:text-white"
                    )}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateLabel())}
                  />
                  <button
                    type="button"
                    onClick={handleCreateLabel}
                    className="px-3 py-1 text-sm rounded bg-secondary text-white hover:bg-secondary-light"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Edit/Delete Existing Labels */}
              {labels.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-primary dark:text-white mb-2">
                    Manage Existing Labels
                  </label>
                  <div className="space-y-2">
                    {labels.map((label) => (
                      <div key={label.id} className="flex items-center gap-2">
                        {editingLabel === label.id ? (
                          <>
                            <input
                              type="text"
                              value={editLabelName}
                              onChange={(e) => setEditLabelName(e.target.value)}
                              className={cn(
                                "flex-1 px-2 py-1 text-sm rounded border",
                                "border-primary dark:border-primary-light",
                                "bg-white dark:bg-primary-dark",
                                "text-primary dark:text-white"
                              )}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateLabel(label.id)}
                              className="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLabel(null);
                                setEditLabelName('');
                              }}
                              className="px-2 py-1 text-xs rounded bg-gray-500 text-white hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 text-sm text-primary dark:text-white">
                              {label.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLabel(label.id);
                                setEditLabelName(label.name);
                              }}
                              className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLabel(label.id)}
                              className="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Select Labels for Task */}
          {labels.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              No labels available. Create one above!
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
      </CardContent>
      <ConfirmModal
        isOpen={!!deleteLabelConfirm}
        onClose={() => setDeleteLabelConfirm(null)}
        onConfirm={confirmDeleteLabel}
        title="Delete Label?"
        message={`Are you sure you want to delete the label "${deleteLabelConfirm?.labelName}"? It will be removed from all tasks.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </Card>
  );
});

export default TaskForm;


