import { useState, FormEvent } from 'react';
import { CreateTaskRequest } from '../../interfaces/tasks';
import { createTask } from '../../services/taskService';
import './CreateTask.css';

interface CreateTaskProps {
  listId: number;
  onTaskCreated?: () => void;
  onCancel?: () => void;
}

export const CreateTask = ({ listId, onTaskCreated, onCancel }: CreateTaskProps) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const data: CreateTaskRequest = {
        list_id: listId,
        task_name: taskName.trim(),
        description: description.trim() || undefined,
        is_completed: isCompleted
      };

      await createTask(data);
      setSuccess('Task created successfully!');
      setTaskName('');
      setDescription('');
      setIsCompleted(false);
      onTaskCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="create-task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="task_name">Task Name</label>
        <input
          type="text"
          id="task_name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">Description (Optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div className="checkbox-row">
        <input
          type="checkbox"
          id="is_completed"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        <label htmlFor="is_completed">Mark as completed</label>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !taskName.trim()}
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}; 