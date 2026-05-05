import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Package, LayoutDashboard, LogOut, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Zap size={22} className="logo-icon" />
          <span>ShopNova</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links hide-mobile">
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
            Products
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="nav-icon-btn" title="Cart">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="user-menu">
                <button className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                  <div className="avatar-circle">
                    {user?.firstName?.[0]?.toUpperCase()}
                  </div>
                  <span className="hide-mobile user-name">{user?.firstName}</span>
                </button>

                {menuOpen && (
                  <div className="dropdown animate-scale">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user?.firstName} {user?.lastName}</p>
                      <p className="dropdown-email">{user?.email}</p>
                      <span className={`badge badge-primary dropdown-role`}>
                        {user?.role?.replace('ROLE_', '')}
                      </span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for dropdown */}
      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
