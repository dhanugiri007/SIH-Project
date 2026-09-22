import { Link } from 'react-router-dom';
import AuthLayout from '../../../shared/components/AuthLayout';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Join SAHYOG FLOW as a customer, worker, or cooperative">
      <SignupForm />
      <p className="text-sm text-gray-500 mt-4 text-center">
        Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
      </p>
    </AuthLayout>
  );
}