import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ListResponse } from '../../interfaces/lists';
import { TaskResponse } from '../../interfaces/tasks';
import { getList, updateList, deleteList } from '../../services/listService';
import { ConfirmModal } from '../Common/ConfirmModal';
import { CreateTask } from '../Tasks/CreateTask';
import { TaskList } from '../Tasks/TaskList';
import './ListDetails.css';

const LoadingSkeleton = () => (
  <div className="list-details">
    <div className="list-header">
      <div className="list-info">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-metadata" />
      </div>
    </div>
  </div>
);

export const ListDetails = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<ListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);

  useEffect(() => {
    const fetchList = async () => {
      if (!listId) {
        setError('List ID is required');
        setIsLoading(false);
        return;
      }

      setError('');
      try {
        const data = await getList(parseInt(listId, 10));
        setList(data);
        setEditedName(data.list_name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch list');
        if (err instanceof Error && err.message === 'Authentication required') {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, [listId, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(list?.list_name || '');
    setError('');
  };

  const handleSave = async () => {
    if (!listId || !editedName.trim()) return;

    setIsUpdating(true);
    setError('');
    setUpdateSuccess(false);

    try {
      const updatedList = await updateList(parseInt(listId, 10), editedName.trim());
      setList(updatedList);
      setIsEditing(false);
      setUpdateSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update list');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!listId) return;

    setIsDeleting(true);
    setError('');

    try {
      await deleteList(parseInt(listId, 10));
      navigate('/lists', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete list');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTaskCreated = () => {
    setShowCreateTask(false);
  };

  const handleTasksLoaded = (loadedTasks: TaskResponse[]) => {
    setTasks(loadedTasks);
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
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="error-container" role="alert">
        <p>{error}</p>
        <button 
          className="action-button" 
          onClick={() => window.location.reload()}
          style={{ marginTop: '1rem' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!list || !listId) {
    return (
      <div className="error-container" role="alert">
        <p>List not found</p>
        <Link to="/lists" className="back-button">
          ← Back to Lists
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="list-details">
        <div className="list-header">
          <div className="list-info">
            {isEditing ? (
              <input
                type="text"
                className="list-title-input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
                aria-label="List name"
                maxLength={50}
              />
            ) : (
              <h1 className="list-title">{list.list_name}</h1>
            )}
            <p className="list-metadata">
              Created: {formatDate(list.created_at)}
            </p>
          </div>
          <div className="list-actions">
            {isEditing ? (
              <>
                <button
                  className="action-button save-button"
                  onClick={handleSave}
                  disabled={isUpdating || !editedName.trim()}
                >
                  {isUpdating ? (
                    <>
                      <span className="action-spinner" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
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
                  className="action-button edit-button" 
                  onClick={handleEdit}
                  aria-label="Edit list name"
                >
                  Edit
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() => setShowDeleteModal(true)}
                  aria-label="Delete list"
                >
                  Delete
                </button>
                <Link to="/lists" className="back-button">
                  ← Back to Lists
                </Link>
              </>
            )}
          </div>
        </div>
        {updateSuccess && (
          <div className="success-message" role="status">
            List updated successfully!
          </div>
        )}

        <div className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">Tasks ({tasks.length})</h2>
            {!showCreateTask && (
              <button
                className="action-button add-button"
                onClick={() => setShowCreateTask(true)}
                aria-label="Add new task"
              >
                Add Task
              </button>
            )}
          </div>

          {showCreateTask && (
            <CreateTask
              listId={parseInt(listId, 10)}
              onTaskCreated={handleTaskCreated}
              onCancel={() => setShowCreateTask(false)}
            />
          )}

          <TaskList
            listId={parseInt(listId, 10)}
            onTasksLoaded={handleTasksLoaded}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete List"
        message="Are you sure you want to delete this list? This action cannot be undone and all tasks in this list will be deleted."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}; 