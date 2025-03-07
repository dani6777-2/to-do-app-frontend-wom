import { useState, useEffect } from 'react';
import { TaskResponse } from '../../interfaces/tasks';
import { getTask, updateTask, deleteTask } from '../../services/taskService';
import { ConfirmModal } from '../Common/ConfirmModal';
import './TaskDetails.css';

interface TaskDetailsProps {
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updatedTask: TaskResponse) => void;
  onDelete?: (taskId: number) => void;
}

export const TaskDetails = ({ taskId, isOpen, onClose, onUpdate, onDelete }: TaskDetailsProps) => {
  const [task, setTask] = useState<TaskResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!isOpen) return;
      
      setIsLoading(true);
      setError('');

      try {
        const data = await getTask(taskId);
        setTask(data);
        setEditedName(data.task_name);
        setEditedDescription(data.description || '');
        setIsCompleted(data.is_completed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId, isOpen]);

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccess(false);
  };

  const handleCancel = () => {
    if (!task) return;
    setIsEditing(false);
    setEditedName(task.task_name);
    setEditedDescription(task.description || '');
    setIsCompleted(task.is_completed);
    setError('');
  };

  const handleSave = async () => {
    if (!task || !editedName.trim()) return;

    setIsUpdating(true);
    setError('');
    setUpdateSuccess(false);

    try {
      const updatedTask = await updateTask(taskId, {
        task_name: editedName.trim(),
        description: editedDescription.trim() || undefined,
        is_completed: isCompleted
      });
      setTask(updatedTask);
      setIsEditing(false);
      setUpdateSuccess(true);
      onUpdate?.(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async () => {
    if (!task) return;

    setIsUpdating(true);
    setError('');

    try {
      const updatedTask = await updateTask(taskId, {
        is_completed: !isCompleted
      });
      setTask(updatedTask);
      setIsCompleted(updatedTask.is_completed);
      onUpdate?.(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await deleteTask(taskId);
      onDelete?.(taskId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="task-details-modal" onClick={onClose}>
        <div className="task-details-content" onClick={e => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>&times;</button>

          {isLoading ? (
            <div className="loading-container">Loading task details...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : task ? (
            <>
              <div className="task-details-header">
                {isEditing ? (
                  <input
                    type="text"
                    className="task-title-input"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Task name"
                    autoFocus
                  />
                ) : (
                  <h2 className="task-details-title">{task.task_name}</h2>
                )}
              </div>

              <div className="task-details-info">
                {isEditing ? (
                  <textarea
                    className="task-description-input"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Task description (optional)"
                  />
                ) : task.description ? (
                  <div className="task-details-description">
                    {task.description}
                  </div>
                ) : null}

                <div className="task-details-metadata">
                  <div className="task-details-status">
                    <label className="status-toggle">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={handleStatusChange}
                        disabled={isUpdating}
                      />
                      <span
                        className={`status-indicator ${isCompleted ? 'completed' : ''}`}
                      />
                      {isCompleted ? 'Completed' : 'Pending'}
                    </label>
                  </div>
                  <div>Created: {formatDate(task.created_at)}</div>
                </div>

                {updateSuccess && (
                  <div className="success-message">
                    Task updated successfully!
                  </div>
                )}

                <div className="task-details-actions">
                  {isEditing ? (
                    <>
                      <button
                        className="action-button save-button"
                        onClick={handleSave}
                        disabled={isUpdating || !editedName.trim()}
                      >
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="action-button cancel-button"
                        onClick={handleCancel}
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="action-button delete-button"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete
                      </button>
                      <button
                        className="action-button edit-button"
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="error-message">Task not found</div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}; 