import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Package, CheckCircle, Clock, XCircle, Loader, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Orders.css';

const TIMELINE = [
  { status: 'PENDING',         label: 'Order Placed',       desc: 'Your order has been received' },
  { status: 'PAYMENT_PENDING', label: 'Payment Processing', desc: 'Payment is being processed' },
  { status: 'PAID',            label: 'Payment Confirmed',  desc: 'Payment successful' },
  { status: 'PROCESSING',      label: 'Preparing Order',    desc: 'Your order is being packed' },
  { status: 'SHIPPED',         label: 'Shipped',            desc: 'Order is on its way' },
  { status: 'DELIVERED',       label: 'Delivered',          desc: 'Order delivered successfully' },
];

const STATUSES_ORDER = ['PENDING','PAYMENT_PENDING','PAID','PROCESSING','SHIPPED','DELIVERED'];

function getStatusIcon(status, order) {
  if (status === 'CANCELLED') return XCircle;
  if (status === 'INVENTORY_FAILED') return AlertTriangle;
  return CheckCircle;
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderApi.getById(id)
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderApi.cancel(id);
      setOrder(o => ({ ...o, status: 'CANCELLED' }));
      toast.success('Order cancelled successfully');
    } catch {
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  if (loading) return <div className="loading-center page-layout"><div className="spinner" /></div>;
  if (!order) return (
    <div className="page-layout container">
      <div className="empty-state"><h3>Order not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>Back to Orders</button>
      </div>
    </div>
  );

  const currentIdx = STATUSES_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'INVENTORY_FAILED';
  const canCancel = !isCancelled && order.status === 'PENDING';

  return (
    <div className="page-layout container">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/orders')}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Header */}
      <div className="order-detail-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>
            Order #{order.id?.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-secondary" style={{ marginTop: 4 }}>Placed on {fmtDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge badge-${isCancelled ? 'danger' : order.status === 'DELIVERED' ? 'success' : 'warning'}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
            {order.status?.replace('_', ' ')}
          </span>
          {canCancel && (
            <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling…' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Order Items */}
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              <Package size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Order Items ({order.items?.length || 0})
            </h2>
            {(order.items || []).map((item, i) => (
              <div key={i} className="checkout-item">
                <div>
                  <p className="checkout-item-name">{item.productId?.slice(0, 8)}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="checkout-item-price">{fmt((item.price || 0) * item.quantity)}</span>
              </div>
            ))}
            <div style={{ paddingTop: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem' }}>
              <span>Total</span><span>{fmt(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Progress</h2>
          {isCancelled ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--danger)' }}>
              <XCircle size={48} />
              <p style={{ marginTop: '0.75rem', fontWeight: 700 }}>Order {order.status.replace('_', ' ')}</p>
            </div>
          ) : (
            <div className="order-timeline">
              {TIMELINE.map((step, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                const pending = i > currentIdx;
                return (
                  <div key={step.status} className="timeline-item">
                    <div className={`timeline-dot ${active ? 'active' : done ? 'done' : 'pending'}`}>
                      {done ? <CheckCircle size={15} /> : active ? <Loader size={15} /> : <Clock size={15} />}
                    </div>
                    <div className="timeline-content">
                      <p className={`timeline-label ${pending ? 'text-muted' : ''}`}>{step.label}</p>
                      <p className="timeline-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
