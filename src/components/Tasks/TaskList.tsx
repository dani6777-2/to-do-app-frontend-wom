import { useState, useEffect } from 'react';
import { TaskResponse } from '../../interfaces/tasks';
import { getAllTasks, updateTask } from '../../services/taskService';
import { TaskDetails } from './TaskDetails';
import './TaskList.css';

interface TaskListProps {
  listId?: number; // Optional: to filter tasks by list
  onTasksLoaded?: (tasks: TaskResponse[]) => void;
}

export const TaskList = ({ listId, onTasksLoaded }: TaskListProps) => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allTasks = await getAllTasks();
        const filteredTasks = listId
          ? allTasks.filter(task => task.list_id === listId)
          : allTasks;
        
        setTasks(filteredTasks);
        onTasksLoaded?.(filteredTasks);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [listId, onTasksLoaded]);

  const handleTaskUpdate = (updatedTask: TaskResponse) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.task_id === updatedTask.task_id ? updatedTask : task
      )
    );
    onTasksLoaded?.(tasks.map(task =>
      task.task_id === updatedTask.task_id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks(currentTasks => currentTasks.filter(task => task.task_id !== taskId));
    onTasksLoaded?.(tasks.filter(task => task.task_id !== taskId));
  };

  const handleCheckboxChange = async (taskId: number, currentStatus: boolean) => {
    setUpdatingTaskId(taskId);
    try {
      const updatedTask = await updateTask(taskId, {
        is_completed: !currentStatus
      });
      handleTaskUpdate(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
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

  if (isLoading) {
    return <div className="loading-tasks">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-tasks">
        No tasks found. Create your first task!
      </div>
    );
  }

  return (
    <>
      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.task_id}
            className={`task-card ${task.is_completed ? 'completed' : ''}`}
            onClick={() => setSelectedTaskId(task.task_id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedTaskId(task.task_id);
              }
            }}
          >
            <div className="task-header">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.is_completed}
                disabled={updatingTaskId === task.task_id}
                onChange={() => handleCheckboxChange(task.task_id, task.is_completed)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="task-content">
                <h3 className="task-name">{task.task_name}</h3>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-metadata">
                  <span className="task-date">
                    Created: {formatDate(task.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTaskId && (
        <TaskDetails
          taskId={selectedTaskId}
          isOpen={true}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </>
  );
}; 