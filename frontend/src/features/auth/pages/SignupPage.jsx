import { Link } from 'react-router-dom';
import AuthLayout from '../../../shared/components/AuthLayout';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account."
      subtitle="Join Sahyog Flow as an autonomous worker, service customer, or cooperative leader."
      activeMode="signup"
    >
      <SignupForm />
      <div className="mt-5 text-center text-sm text-[#596174]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#B8861B] hover:text-[#A57412] font-semibold underline underline-offset-2">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}