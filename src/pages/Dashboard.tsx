import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { CreateList } from '../components/Lists/CreateList';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
      navigate('/login');
    }
  }, [navigate]);

  const handleListCreated = () => {
    // You can add additional logic here when a list is created
    // For example, refresh the dashboard data
  };

  return (
    <Layout>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome to Your Todo Dashboard</h1>
        <p className="dashboard-subtitle">Manage your tasks and stay organized</p>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/lists" className="action-card">
            <h3 className="action-title">View Lists</h3>
            <p className="action-description">
              See all your todo lists and manage them
            </p>
          </Link>
          <div className="action-card">
            <h3 className="action-title">Create New List</h3>
            <p className="action-description">
              Start organizing your tasks in a new list
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Create New List</h2>
        <CreateList onListCreated={handleListCreated} />
      </div>
    </Layout>
  );
}; 