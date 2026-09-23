import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/authContext';
import { NotificationProvider } from './features/notification/notificationContext';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import NewJobPage from './features/jobRequest/pages/NewJobPage';
import MyJobsPage from './features/jobRequest/pages/MyJobsPage';
import JobDetailPage from './features/jobRequest/pages/JobDetailPage';
import WorkerDashboardPage from './features/workerTasks/pages/WorkerDashboardPage';
import EarningsPage from './features/workerTasks/pages/EarningsPage';
import WorkerSettingsPage from './features/workerTasks/pages/WorkerSettingsPage';
import AdminDashboardPage from './features/cooperativeAdmin/pages/AdminDashboard';
import ProtectedRoute from './shared/components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/customer" element={<Navigate to="/customer/jobs" replace />} />
            <Route path="/customer/jobs" element={<ProtectedRoute allowedRoles={['customer']}><MyJobsPage /></ProtectedRoute>} />
            <Route path="/customer/jobs/:jobId" element={<ProtectedRoute allowedRoles={['customer']}><JobDetailPage /></ProtectedRoute>} />
            <Route path="/customer/new" element={<ProtectedRoute allowedRoles={['customer']}><NewJobPage /></ProtectedRoute>} />

            <Route path="/worker" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboardPage /></ProtectedRoute>} />
            <Route path="/worker/earnings" element={<ProtectedRoute allowedRoles={['worker']}><EarningsPage /></ProtectedRoute>} />
            <Route path="/worker/settings" element={<ProtectedRoute allowedRoles={['worker']}><WorkerSettingsPage /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute allowedRoles={['cooperativeAdmin']}><AdminDashboardPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}