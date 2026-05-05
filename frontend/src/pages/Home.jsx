import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShoppingBag, Zap, Shield, Truck, Star, Package } from 'lucide-react';
import './Home.css';

const FEATURES = [
  { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'Microservices architecture ensures blazing-fast responses' },
  { icon: <Shield size={24} />, title: 'Secure Payments', desc: 'End-to-end encrypted transactions powered by Kafka events' },
  { icon: <Truck size={24} />, title: 'Real-time Tracking', desc: 'Live order status updates from placement to delivery' },
  { icon: <Star size={24} />, title: 'Premium Quality', desc: 'Curated products from top brands worldwide' },
];

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#6C63FF' },
  { name: 'Fashion', icon: '👗', color: '#FF6584' },
  { name: 'Home & Living', icon: '🏠', color: '#10B981' },
  { name: 'Sports', icon: '⚽', color: '#F59E0B' },
  { name: 'Books', icon: '📚', color: '#3B82F6' },
  { name: 'Beauty', icon: '💄', color: '#EC4899' },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      {/* ======= Hero ======= */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content container">
          <div className="hero-text animate-fade">
            <div className="hero-tag">
              <Zap size={14} /> Next-Gen E-Commerce
            </div>
            <h1 className="hero-title">
              Shop Smarter,<br />
              <span className="text-gradient">Live Better</span>
            </h1>
            <p className="hero-subtitle">
              Experience the future of online shopping with real-time inventory,
              instant payments, and personalized recommendations — all powered by
              microservices.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                <ShoppingBag size={18} />
                Explore Products
                <ArrowRight size={18} />
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline btn-lg">
                  Get Started Free
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/orders" className="btn btn-outline btn-lg">
                  My Orders
                </Link>
              )}
            </div>
          </div>

          <div className="hero-visual animate-scale">
            <div className="hero-card-stack">
              <div className="hero-card c1">
                <Package size={28} />
                <div>
                  <p className="hero-card-num">10K+</p>
                  <p className="hero-card-label">Products</p>
                </div>
              </div>
              <div className="hero-card c2">
                <Truck size={28} />
                <div>
                  <p className="hero-card-num">99.9%</p>
                  <p className="hero-card-label">Uptime</p>
                </div>
              </div>
              <div className="hero-card c3">
                <Star size={28} />
                <div>
                  <p className="hero-card-num">4.9★</p>
                  <p className="hero-card-label">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= Categories ======= */}
      <section className="section container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p className="text-secondary">Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="category-card"
              style={{ '--cat-color': cat.color }}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ======= Features ======= */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why ShopNova?</h2>
            <p className="text-secondary">Built on cutting-edge microservices technology</p>
          </div>
          <div className="grid grid-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      {!isAuthenticated && (
        <section className="cta-section container">
          <div className="cta-card">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of happy customers today.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">Already have an account?</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
