import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { CheckCircle, Package, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { cart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const items = cart?.items || [];

  const handlePlaceOrder = async () => {
    if (!items.length) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const orderPayload = {
        userId: user.id,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      };
      const { data } = await orderApi.create(orderPayload);
      setOrderId(data.id);
      setPlaced(true);
      await clearCart();
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (placed) return (
    <div className="page-layout container">
      <div className="order-success animate-scale">
        <div className="success-icon">
          <CheckCircle size={56} />
        </div>
        <h1>Order Placed!</h1>
        <p>Your order has been placed successfully and is being processed.</p>
        {orderId && <p className="order-id-text">Order ID: <code>{orderId}</code></p>}
        <div className="success-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/orders/${orderId}`)}>
            Track Order
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-layout container">
      <div className="page-header">
        <h1>Checkout</h1>
        <p>Review your order and confirm</p>
      </div>

      <div className="checkout-layout">
        {/* Order Summary */}
        <div className="checkout-items card">
          <h2 className="checkout-section-title">
            <Package size={18} /> Order Items ({items.length})
          </h2>

          {items.map((item) => (
            <div key={item.productId} className="checkout-item">
              <div>
                <p className="checkout-item-name">{item.productName || 'Product'}</p>
                <p className="checkout-item-qty">Qty: {item.quantity}</p>
              </div>
              <span className="checkout-item-price">
                {fmt((item.price || 0) * item.quantity)}
              </span>
            </div>
          ))}

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span><span>{fmt(totalAmount)}</span>
            </div>
            <div className="checkout-total-row">
              <span>GST (18%)</span><span>{fmt(totalAmount * 0.18)}</span>
            </div>
            <div className="checkout-total-row checkout-grand-total">
              <span>Grand Total</span><span>{fmt(totalAmount * 1.18)}</span>
            </div>
          </div>
        </div>

        {/* Payment + Delivery */}
        <div className="checkout-right">
          {/* Delivery Info */}
          <div className="card checkout-info-card">
            <h2 className="checkout-section-title">
              <Package size={18} /> Delivery Details
            </h2>
            <div className="checkout-info-row">
              <span className="text-muted">Name</span>
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="checkout-info-row">
              <span className="text-muted">Email</span>
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="checkout-info-row">
                <span className="text-muted">Phone</span>
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card checkout-payment-card">
            <h2 className="checkout-section-title">
              <CreditCard size={18} /> Payment
            </h2>
            <div className="payment-method-badge">
              <span>💳</span>
              <div>
                <p className="font-semibold">Simulated Payment</p>
                <p className="text-sm text-muted">Payment is processed automatically via Kafka</p>
              </div>
            </div>
          </div>

          <button
            id="place-order-btn"
            className="btn btn-primary btn-full btn-lg"
            onClick={handlePlaceOrder}
            disabled={loading || items.length === 0}
          >
            {loading
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing…</>
              : `Place Order · ${fmt(totalAmount * 1.18)}`}
          </button>
          <p className="checkout-disclaimer">
            🔒 By placing the order, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
