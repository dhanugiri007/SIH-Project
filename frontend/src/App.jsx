import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/authContext';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import NewJobPage from './features/jobRequest/pages/NewJobPage';
import MyJobsPage from './features/jobRequest/pages/MyJobsPage';
import JobDetailPage from './features/jobRequest/pages/JobDetailPage';
import ProtectedRoute from './shared/components/ProtectedRoute';

const WorkerDashboard = () => <div className="p-8">Worker Dashboard (Flow 4+)</div>;
const AdminDashboard = () => <div className="p-8">Cooperative Admin Dashboard (Flow 11)</div>;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/customer" element={<Navigate to="/customer/jobs" replace />} />
          <Route path="/customer/jobs" element={<ProtectedRoute allowedRoles={['customer']}><MyJobsPage /></ProtectedRoute>} />
          <Route path="/customer/jobs/:jobId" element={<ProtectedRoute allowedRoles={['customer']}><JobDetailPage /></ProtectedRoute>} />
          <Route path="/customer/new" element={<ProtectedRoute allowedRoles={['customer']}><NewJobPage /></ProtectedRoute>} />

          <Route path="/worker" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['cooperativeAdmin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}