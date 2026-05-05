import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { User, Mail, Phone, Shield, Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import './Profile.css';

const ROLE_LABELS = {
  ROLE_ADMIN:    { label: 'Administrator', color: 'danger' },
  ROLE_SELLER:   { label: 'Seller',        color: 'warning' },
  ROLE_CUSTOMER: { label: 'Customer',      color: 'primary' },
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
    newPassword: '',
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {};
    if (form.firstName !== user?.firstName) payload.firstName = form.firstName;
    if (form.lastName  !== user?.lastName)  payload.lastName  = form.lastName;
    if (form.phone     !== user?.phone)     payload.phone     = form.phone;
    if (form.newPassword)                   payload.newPassword = form.newPassword;

    if (!Object.keys(payload).length) { toast('No changes to save'); return; }

    setLoading(true);
    try {
      const { data } = await authApi.updateProfile(payload);
      updateUser(data);
      setForm(f => ({ ...f, newPassword: '' }));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = ROLE_LABELS[user?.role] || { label: user?.role, color: 'muted' };

  return (
    <div className="page-layout container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account details</p>
      </div>

      <div className="profile-layout">
        {/* Left: Info card */}
        <div className="profile-info-card card animate-fade">
          <div className="profile-avatar">
            {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
          </div>
          <h2 className="profile-name">{user?.firstName} {user?.lastName}</h2>
          <p className="profile-email"><Mail size={14} /> {user?.email}</p>
          {user?.phone && <p className="profile-phone"><Phone size={14} /> {user.phone}</p>}

          <div className="profile-role-badge">
            <Shield size={14} />
            <span className={`badge badge-${roleConfig.color}`}>{roleConfig.label}</span>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <p className="stat-value">{user?.active ? '✓ Active' : '✗ Inactive'}</p>
              <p className="stat-label">Status</p>
            </div>
            <div className="profile-stat">
              <p className="stat-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
              </p>
              <p className="stat-label">Member Since</p>
            </div>
          </div>
        </div>

        {/* Right: Edit form */}
        <div className="profile-edit-card card animate-slide">
          <h2 className="card-section-title">Edit Profile</h2>
          <form onSubmit={handleSave} className="profile-form">
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-icon-wrapper">
                  <User size={15} className="input-icon" />
                  <input id="profile-firstname" type="text" className="form-input with-icon"
                    value={form.firstName} onChange={set('firstName')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-icon-wrapper">
                  <User size={15} className="input-icon" />
                  <input id="profile-lastname" type="text" className="form-input with-icon"
                    value={form.lastName} onChange={set('lastName')} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrapper">
                <Mail size={15} className="input-icon" />
                <input type="email" className="form-input with-icon" value={user?.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
              <p className="text-xs text-muted" style={{ marginTop: 4 }}>Email cannot be changed</p>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <div className="input-icon-wrapper">
                <Phone size={15} className="input-icon" />
                <input id="profile-phone" type="tel" className="form-input with-icon"
                  value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="profile-divider">
              <span>Change Password</span>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-icon-wrapper">
                <Lock size={15} className="input-icon" />
                <input id="profile-password" type="password" className="form-input with-icon"
                  value={form.newPassword} onChange={set('newPassword')}
                  placeholder="Leave blank to keep current" />
              </div>
            </div>

            <button id="profile-save-btn" type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
