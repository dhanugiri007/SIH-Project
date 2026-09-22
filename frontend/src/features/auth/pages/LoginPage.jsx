import { Link } from 'react-router-dom';
import AuthLayout from '../../../shared/components/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your SAHYOG FLOW account">
      <LoginForm />
      <p className="text-sm text-gray-500 mt-4 text-center">
        Don't have an account? <Link to="/signup" className="text-indigo-600 font-medium">Sign up</Link>
      </p>
    </AuthLayout>
  );
}