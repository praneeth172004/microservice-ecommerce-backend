import { useState, useEffect } from 'react';
import { authApi } from '../../api/authApi';
import { Users, Search, Shield, UserCheck, UserX, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

const ROLES = ['ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_CUSTOMER'];
const ROLE_BADGE = { ROLE_ADMIN: 'danger', ROLE_SELLER: 'warning', ROLE_CUSTOMER: 'primary' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [changingId, setChangingId] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    authApi.getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch(() => toast.error('Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const handleRoleChange = async (userId, newRole) => {
    setChangingId(userId);
    try {
      const { data } = await authApi.changeRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? data : u));
      toast.success('Role updated!');
    } catch {
      toast.error('Failed to change role');
    } finally {
      setChangingId(null);
    }
  };

  const handleToggleStatus = async (userId) => {
    setChangingId(userId);
    try {
      const { data } = await authApi.toggleStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? data : u));
      toast.success(`User ${data.active ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setChangingId(null);
    }
  };

  const filtered = users
    .filter(u => roleFilter === 'All' || u.role === roleFilter)
    .filter(u => !search || u.email.toLowerCase().includes(search.toLowerCase())
      || `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-layout container">
      <div className="page-header">
        <h1>User Management</h1>
        <p>{users.length} total users</p>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={16} className="search-icon" />
          <input id="user-search" type="text" className="form-input search-input"
            placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['All', ...ROLES.map(r => r.replace('ROLE_', ''))].map(r => (
            <button key={r}
              className={`cat-tab ${(roleFilter === 'All' && r === 'All') || roleFilter === `ROLE_${r}` ? 'active' : ''}`}
              onClick={() => setRoleFilter(r === 'All' ? 'All' : `ROLE_${r}`)}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-cell-avatar">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <span className="font-semibold">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="text-muted text-sm">{u.email}</td>
                  <td>
                    <select
                      className="role-select"
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      disabled={changingId === u.id}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r.replace('ROLE_', '')}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`badge badge-${u.active ? 'success' : 'muted'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-muted text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.active ? 'btn-outline' : 'btn-primary'}`}
                      onClick={() => handleToggleStatus(u.id)}
                      disabled={changingId === u.id}
                      title={u.active ? 'Deactivate' : 'Activate'}
                    >
                      {u.active ? <UserX size={14} /> : <UserCheck size={14} />}
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
