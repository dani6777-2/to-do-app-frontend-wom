import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateList } from '../components/Lists/CreateList';
import { ListGrid } from '../components/Lists/ListGrid';

export const Lists = () => {
  const navigate = useNavigate();
  const listGridRef = useRef<{ fetchLists: () => Promise<void> } | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
      navigate('/login');
    }
  }, [navigate]);

  const handleListCreated = () => {
    // Refresh the list grid when a new list is created
    listGridRef.current?.fetchLists();
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Todo Lists</h1>
        <p className="dashboard-subtitle">Create and manage your todo lists</p>
      </div>
      
      <div className="dashboard-section">
        <h2 className="section-title">Create New List</h2>
        <CreateList onListCreated={handleListCreated} />
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Your Lists</h2>
        <ListGrid ref={listGridRef} />
      </div>
    </div>
  );
}; 