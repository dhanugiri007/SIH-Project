import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRoleHint, setSelectedRoleHint] = useState('worker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login({ email: form.email, password: form.password });
      const dest =
        user.role === 'customer' ? '/customer' : user.role === 'worker' ? '/worker' : '/admin';
      navigate(dest);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Selection Tabs */}
      <div>
        <label className="block text-xs font-semibold text-[#101010] uppercase tracking-wide mb-1.5">
          Select Workspace
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F5F2EB] rounded-xl border border-[#E8E5DE]">
          <button
            type="button"
            onClick={() => setSelectedRoleHint('worker')}
            className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
              selectedRoleHint === 'worker'
                ? 'bg-white text-[#B8861B] shadow-sm'
                : 'text-[#596174] hover:text-[#101010]'
            }`}
          >
            Worker
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoleHint('customer')}
            className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
              selectedRoleHint === 'customer'
                ? 'bg-white text-[#B8861B] shadow-sm'
                : 'text-[#596174] hover:text-[#101010]'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setSelectedRoleHint('cooperativeAdmin')}
            className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all duration-150 ${
              selectedRoleHint === 'cooperativeAdmin'
                ? 'bg-white text-[#B8861B] shadow-sm'
                : 'text-[#596174] hover:text-[#101010]'
            }`}
          >
            Coop Admin
          </button>
        </div>
      </div>

      {/* Email / ID Input */}
      <div>
        <Input
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          placeholder={
            selectedRoleHint === 'worker'
              ? 'worker@coop.in'
              : selectedRoleHint === 'customer'
              ? 'customer@gmail.com'
              : 'admin@cooperative.org'
          }
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      {/* Password Input with show/hide toggle */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-xs font-medium text-[#8A909F] hover:text-[#596174] transition-colors"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Remember Device & Forgot Password */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-[#596174] select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[#E8E5DE] text-[#B8861B] focus:ring-[#C99A32]/25 accent-[#B8861B]"
          />
          <span>Remember this device</span>
        </label>
        <button
          type="button"
          onClick={() => alert('Password reset links are managed via your cooperative administrator.')}
          className="text-[#B8861B] hover:text-[#A57412] font-semibold transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 rounded-xl bg-[#FCE9E7] border border-[#F5C2BF] text-xs text-[#C2413B] font-medium flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Primary Gold Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          iconRight={
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          }
        >
          {loading ? 'Authenticating...' : 'Sign In to Workspace'}
        </Button>
      </div>
    </form>
  );
}