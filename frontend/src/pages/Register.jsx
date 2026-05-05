import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Zap, Mail, Lock, User, Phone } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName || form.firstName.length < 2) e.firstName = 'Min 2 characters';
    if (!form.lastName || form.lastName.length < 2) e.lastName = 'Min 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch {}
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card auth-card-wide animate-scale">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Zap size={20} /><span>ShopNova</span>
          </Link>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start shopping in seconds — free forever</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="grid-2" style={{ gap: '1rem' }}>
            {/* First Name */}
            <div className="form-group">
              <label className="form-label">First Name</label>
              <div className="input-icon-wrapper">
                <User size={16} className="input-icon" />
                <input id="reg-firstname" type="text" className={`form-input with-icon ${errors.firstName ? 'error' : ''}`}
                  placeholder="John" value={form.firstName} onChange={set('firstName')} />
              </div>
              {errors.firstName && <p className="form-error">{errors.firstName}</p>}
            </div>
            {/* Last Name */}
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <div className="input-icon-wrapper">
                <User size={16} className="input-icon" />
                <input id="reg-lastname" type="text" className={`form-input with-icon ${errors.lastName ? 'error' : ''}`}
                  placeholder="Doe" value={form.lastName} onChange={set('lastName')} />
              </div>
              {errors.lastName && <p className="form-error">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input id="reg-email" type="email" className={`form-input with-icon ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone <span className="text-muted" style={{fontWeight:400,textTransform:'none'}}>(optional)</span></label>
            <div className="input-icon-wrapper">
              <Phone size={16} className="input-icon" />
              <input id="reg-phone" type="tel" className="form-input with-icon"
                placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input id="reg-password" type={showPw ? 'text' : 'password'}
                className={`form-input with-icon with-icon-right ${errors.password ? 'error' : ''}`}
                placeholder="Min 6 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
              <button type="button" className="input-icon-right-btn" onClick={() => setShowPw(s => !s)} tabIndex={-1}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          {/* Role info banner */}
          <div className="auth-info-banner">
            🛍️ You'll be registered as a <strong>Customer</strong>. Admins can upgrade your role later.
          </div>

          <button id="reg-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <span className="spinner" style={{width:18,height:18,borderWidth:2}} /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
