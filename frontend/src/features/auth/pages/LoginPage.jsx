import { Link } from 'react-router-dom';
import AuthLayout from '../../../shared/components/AuthLayout';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to your Sahyog Flow workspace to manage jobs, routes, and earnings."
      activeMode="login"
    >
      <LoginForm />
      <div className="mt-5 text-center text-sm text-[#596174]">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-[#B8861B] hover:text-[#A57412] font-semibold underline underline-offset-2">
          Join Sahyog
        </Link>
      </div>
    </AuthLayout>
  );
}