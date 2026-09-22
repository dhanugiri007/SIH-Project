import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/authContext';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import ProtectedRoute from './shared/components/ProtectedRoute';

// Placeholder dashboards — real ones come with later flows
const CustomerDashboard = () => <div className="p-8">Customer Dashboard (Flow 2+)</div>;
const WorkerDashboard = () => <div className="p-8">Worker Dashboard (Flow 4+)</div>;
const AdminDashboard = () => <div className="p-8">Cooperative Admin Dashboard (Flow 11)</div>;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
          <Route path="/worker" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['cooperativeAdmin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
