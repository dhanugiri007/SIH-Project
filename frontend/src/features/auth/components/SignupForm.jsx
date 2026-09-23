import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import { useCooperatives } from '../hooks/useCooperatives';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import RoleSelect from './RoleSelect';

export default function SignupForm() {
  const { register, registerCooperative } = useAuth();
  const { cooperatives, loading: loadingCoops } = useCooperatives();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    cooperativeId: '',
    skills: '',
    coopName: '',
    registrationNumber: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;

      if (role === 'cooperativeAdmin') {
        user = await registerCooperative({
          coopName: form.coopName,
          registrationNumber: form.registrationNumber,
          address: form.address,
          adminName: form.name,
          adminEmail: form.email,
          adminPhone: form.phone,
          adminPassword: form.password,
        });
      } else {
        const payload = {
          ...form,
          role,
          skills: role === 'worker' ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        };
        user = await register(payload);
      }

      const dest = user.role === 'customer' ? '/customer' : user.role === 'worker' ? '/worker' : '/admin';
      navigate(dest);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RoleSelect value={role} onChange={setRole} />

      {role === 'cooperativeAdmin' && (
        <div className="p-3.5 bg-[#FAF9F6] border border-[#E8E5DE] rounded-xl space-y-3 mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B8861B]">
            Cooperative Legal Entity Details
          </p>
          <Input
            label="Cooperative Name"
            required
            placeholder="e.g. Pune Electricians Cooperative"
            value={form.coopName}
            onChange={(e) => setForm({ ...form, coopName: e.target.value })}
          />
          <Input
            label="Govt Registration Number"
            required
            placeholder="e.g. COOP/MH/2024/9912"
            value={form.registrationNumber}
            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
          />
          <Input
            label="Operating Registered Address"
            placeholder="Registered office address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <p className="text-[11px] text-[#596174] italic">
            Enter administrator account credentials below to manage this entity:
          </p>
        </div>
      )}

      <Input
        label="Full Name"
        required
        placeholder="Enter your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        label="Email Address"
        type="email"
        required
        placeholder="name@domain.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Input
        label="Phone Number"
        required
        placeholder="+91 98765 43210"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <Input
        label="Password"
        type="password"
        required
        placeholder="Create a secure password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {role === 'worker' && (
        <div className="p-3.5 bg-[#FAF9F6] border border-[#E8E5DE] rounded-xl space-y-3 mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#B8861B]">
            Cooperative Affiliation & Skills
          </p>
          <div>
            <label className="block text-xs font-semibold text-[#101010] uppercase tracking-wide mb-1.5">
              Affiliated Cooperative
            </label>
            <select
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#E8E5DE] rounded-xl text-sm text-[#101010] outline-none focus:ring-2 focus:ring-[#C99A32]/25 focus:border-[#C99A32] transition-colors"
              value={form.cooperativeId}
              onChange={(e) => setForm({ ...form, cooperativeId: e.target.value })}
            >
              <option value="">{loadingCoops ? 'Loading registered cooperatives...' : 'Select your primary cooperative'}</option>
              {cooperatives.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Work Skills (comma-separated)"
            placeholder="electrical, appliance repair, plumbing"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            helperText="Tasks will be matched to you based on your verified skills."
          />
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-[#FCE9E7] border border-[#F5C2BF] text-xs text-[#C2413B] font-medium flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

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
          {loading ? 'Creating Member Account...' : 'Complete Registration'}
        </Button>
      </div>
    </form>
  );
}