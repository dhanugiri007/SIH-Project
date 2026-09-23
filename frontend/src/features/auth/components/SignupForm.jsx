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
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <RoleSelect value={role} onChange={setRole} />

      {role === 'cooperativeAdmin' && (
        <>
          <Input
            label="Cooperative name"
            required
            value={form.coopName}
            onChange={(e) => setForm({ ...form, coopName: e.target.value })}
          />
          <Input
            label="Registration number"
            required
            value={form.registrationNumber}
            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
          />
          <Input
            label="Address (optional)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <p className="text-xs text-gray-400 mb-2">Now enter your details as the admin of this cooperative:</p>
        </>
      )}

      <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

      {role === 'worker' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cooperative</label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.cooperativeId}
              onChange={(e) => setForm({ ...form, cooperativeId: e.target.value })}
            >
              <option value="">{loadingCoops ? 'Loading...' : 'Select a cooperative'}</option>
              {cooperatives.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Skills (comma-separated)"
            placeholder="electrical, plumbing"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </>
      )}

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}