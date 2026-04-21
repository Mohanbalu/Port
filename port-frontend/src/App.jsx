import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthContext, AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Bookings from './pages/Bookings';
import Containers from './pages/Containers';
import Customs from './pages/Customs';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MovementTracking from './pages/MovementTracking';
import ReportsDashboard from './pages/ReportsDashboard';
import UsersAdmin from './pages/UsersAdmin';
import Vessels from './pages/Vessels';

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/containers" element={<ProtectedRoute><Containers /></ProtectedRoute>} />
          <Route path="/vessels" element={<ProtectedRoute><Vessels /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/customs" element={<ProtectedRoute><Customs /></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute><MovementTracking /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UsersAdmin /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><ReportsDashboard /></AdminRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
