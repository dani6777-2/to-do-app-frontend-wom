import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListResponse } from '../../interfaces/lists';
import { getAllLists } from '../../services/listService';
import './ListGrid.css';

export interface ListGridHandle {
  fetchLists: () => Promise<void>;
}

const LoadingSkeleton = () => {
  return (
    <div className="loading-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-date" />
        </div>
      ))}
    </div>
  );
};

export const ListGrid = forwardRef<ListGridHandle>((_, ref) => {
  const navigate = useNavigate();
  const [lists, setLists] = useState<ListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchLists = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const data = await getAllLists();
      setLists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lists');
      if (err instanceof Error && err.message === 'Authentication required') {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchLists
  }));

  useEffect(() => {
    fetchLists();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleListClick = (listId: number) => {
    navigate(`/lists/${listId}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent, listId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleListClick(listId);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="error-message" role="alert">
        <p>{error}</p>
        <button 
          className="action-button" 
          onClick={fetchLists}
          style={{ marginTop: '1rem' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="empty-message" role="status">
        No lists found. Create your first todo list!
      </div>
    );
  }

  return (
    <div className="list-grid">
      {lists.map((list) => (
        <div
          key={list.list_id}
          className="list-card"
          onClick={() => handleListClick(list.list_id)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => handleKeyPress(e, list.list_id)}
          aria-label={`${list.list_name} - Created ${formatDate(list.created_at)}`}
        >
          <h3 className="list-name">{list.list_name}</h3>
          <p className="list-date">Created: {formatDate(list.created_at)}</p>
        </div>
      ))}
    </div>
  );
});

ListGrid.displayName = 'ListGrid'; 