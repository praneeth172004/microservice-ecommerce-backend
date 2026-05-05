import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import './Cart.css';

export default function Cart() {
  const { cart, loading, updateItem, removeItem, clearCart, totalAmount, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (!isAuthenticated) {
    return (
      <div className="page-layout container">
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingBag size={32} /></div>
          <h3>Sign in to view your cart</h3>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading && !cart) {
    return (
      <div className="loading-center page-layout">
        <div className="spinner" />
        <p>Loading cart…</p>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="page-layout container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><ShoppingBag size={32} /></div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
          <Link to="/products" className="btn btn-primary">
            <Package size={16} /> Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <div className="cart-header-row">
              <span>Product</span>
              <span>Qty</span>
              <span>Price</span>
              <span />
            </div>

            {items.map((item) => (
              <div key={item.productId || item.id} className="cart-item animate-fade">
                {/* Product Info */}
                <div className="cart-item-info">
                  <div className="cart-item-img">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="cart-item-name">{item.productName || 'Product'}</p>
                    <p className="cart-item-sub">{item.category || ''}</p>
                  </div>
                </div>

                {/* Qty */}
                <div className="qty-control">
                  <button
                    className="btn btn-outline btn-icon qty-btn"
                    onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1))}
                    disabled={loading || item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="btn btn-outline btn-icon qty-btn"
                    onClick={() => updateItem(item.productId, item.quantity + 1)}
                    disabled={loading}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Price */}
                <span className="cart-item-price">
                  {fmt((item.price || 0) * item.quantity)}
                </span>

                {/* Remove */}
                <button
                  className="btn btn-ghost btn-icon remove-btn"
                  onClick={() => removeItem(item.productId)}
                  disabled={loading}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div className="cart-bottom-row">
              <button className="btn btn-ghost btn-sm" onClick={clearCart} disabled={loading}>
                Clear Cart
              </button>
              <Link to="/products" className="btn btn-outline btn-sm">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span>{fmt(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="summary-row">
                <span>Tax (GST 18%)</span>
                <span>{fmt(totalAmount * 0.18)}</span>
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <span>{fmt(totalAmount * 1.18)}</span>
            </div>

            <button
              id="checkout-btn"
              className="btn btn-primary btn-full btn-lg checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>

            <div className="summary-security">
              🔒 Secure checkout powered by ShopNova
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
