import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, ArrowLeft, Package, Tag, Building2, BarChart3, Plus, Minus } from 'lucide-react';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    productApi.getById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    await addToCart(product.id, qty);
  };

  if (loading) return (
    <div className="loading-center page-layout">
      <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
      <p>Loading product…</p>
    </div>
  );

  if (!product) return (
    <div className="page-layout container">
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h3>Product not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    </div>
  );

  const inStock = product.stockQuantity > 0;

  return (
    <div className="page-layout container">
      {/* Back */}
      <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="product-detail-grid">
        {/* Image */}
        <div className="product-detail-image animate-fade">
          <div className="detail-image-box">
            <Package size={80} className="detail-image-icon" />
          </div>
          {product.category && (
            <span className="badge badge-primary detail-category">{product.category}</span>
          )}
        </div>

        {/* Info */}
        <div className="product-detail-info animate-slide">
          {product.brand && (
            <div className="detail-brand">
              <Building2 size={14} /> {product.brand}
            </div>
          )}

          <h1 className="detail-name">{product.productName}</h1>

          <div className="detail-price">{formatPrice(product.price)}</div>

          {/* Stock status */}
          <div className="detail-stock">
            {inStock ? (
              <span className="badge badge-success">
                <span className="stock-dot" /> In Stock ({product.stockQuantity} units)
              </span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Meta */}
          <div className="detail-meta">
            {product.category && (
              <div className="meta-item">
                <Tag size={14} />
                <span>Category:</span>
                <strong>{product.category}</strong>
              </div>
            )}
            <div className="meta-item">
              <BarChart3 size={14} />
              <span>Stock:</span>
              <strong>{product.stockQuantity} units</strong>
            </div>
          </div>

          {/* Quantity + Cart */}
          {inStock && (
            <div className="detail-actions">
              <div className="qty-control">
                <button
                  className="btn btn-outline btn-icon qty-btn"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{qty}</span>
                <button
                  className="btn btn-outline btn-icon qty-btn"
                  onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))}
                  disabled={qty >= product.stockQuantity}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                id="add-to-cart-btn"
                className="btn btn-primary btn-lg add-cart-btn"
                onClick={handleAddToCart}
                disabled={cartLoading}
              >
                <ShoppingCart size={18} />
                {cartLoading ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <p className="detail-login-hint">
              <a onClick={() => navigate('/login')} className="auth-link" style={{cursor:'pointer'}}>Sign in</a> to add items to your cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
