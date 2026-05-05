import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { productApi } from '../../api/productApi';
import { Users, Package, ShoppingBag, TrendingUp, ChevronRight, Shield } from 'lucide-react';
import './Admin.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    authApi.getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));

    productApi.getAll(0, 100)
      .then(({ data }) => setProducts(Array.isArray(data) ? data : data.content || []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const totalRevenue = 0; // Would come from order service
  const admins = users.filter(u => u.role === 'ROLE_ADMIN').length;
  const sellers = users.filter(u => u.role === 'ROLE_SELLER').length;
  const customers = users.filter(u => u.role === 'ROLE_CUSTOMER').length;

  const STATS = [
    { icon: <Users size={24} />, label: 'Total Users', value: users.length, sub: `${customers} customers, ${sellers} sellers`, color: 'primary' },
    { icon: <Package size={24} />, label: 'Total Products', value: products.length, sub: 'Listed in catalogue', color: 'success' },
    { icon: <Shield size={24} />, label: 'Admins', value: admins, sub: 'With full access', color: 'danger' },
    { icon: <TrendingUp size={24} />, label: 'Revenue', value: '—', sub: 'Connect order-service', color: 'warning' },
  ];

  return (
    <div className="page-layout container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your platform from one place</p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className={`admin-stat-card card stat-${s.color}`}>
            <div className={`admin-stat-icon icon-${s.color}`}>{s.icon}</div>
            <div>
              <p className="admin-stat-value">{s.value}</p>
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-sub">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="admin-quick-grid">
        <Link to="/admin/users" className="admin-quick-card card">
          <div className="admin-quick-left">
            <div className="admin-quick-icon"><Users size={22} /></div>
            <div>
              <h3>User Management</h3>
              <p>View, edit roles, and manage user accounts</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </Link>

        <Link to="/admin/products" className="admin-quick-card card">
          <div className="admin-quick-left">
            <div className="admin-quick-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)' }}>
              <Package size={22} />
            </div>
            <div>
              <h3>Product Management</h3>
              <p>Add, update, and remove products from the catalogue</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </Link>
      </div>

      {/* Recent Users */}
      <div className="card admin-recent">
        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Users</h2>
          <Link to="/admin/users" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {loadingUsers ? (
          <div className="loading-center" style={{ minHeight: 100 }}><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map(u => (
                  <tr key={u.id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge badge-${u.role === 'ROLE_ADMIN' ? 'danger' : u.role === 'ROLE_SELLER' ? 'warning' : 'primary'}`}>
                        {u.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td><span className={`badge badge-${u.active ? 'success' : 'muted'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                    <td className="text-muted text-sm">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
