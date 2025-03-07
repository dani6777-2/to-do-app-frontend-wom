import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Register } from './components/Register/Register';
import { Login } from './components/Login/Login';
import { Lists } from './pages/Lists';
import { Dashboard } from './pages/Dashboard';
import { Layout } from './components/Layout/Layout';
import { ListDetails } from './components/Lists/ListDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lists" element={<Layout><Lists /></Layout>} />
          <Route path="/lists/:listId" element={<Layout><ListDetails /></Layout>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
