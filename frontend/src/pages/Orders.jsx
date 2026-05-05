import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import './Orders.css';

const STATUS_CONFIG = {
  PENDING:           { label: 'Pending',          icon: Clock,         color: 'warning' },
  PAYMENT_PENDING:   { label: 'Payment Pending',   icon: Loader,        color: 'warning' },
  INVENTORY_FAILED:  { label: 'Stock Unavailable', icon: XCircle,       color: 'danger'  },
  PAID:              { label: 'Paid',              icon: CheckCircle,   color: 'success' },
  PROCESSING:        { label: 'Processing',        icon: Loader,        color: 'info'    },
  SHIPPED:           { label: 'Shipped',           icon: Package,       color: 'info'    },
  DELIVERED:         { label: 'Delivered',         icon: CheckCircle,   color: 'success' },
  CANCELLED:         { label: 'Cancelled',         icon: XCircle,       color: 'danger'  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'muted' };
  return <span className={`badge badge-${cfg.color}`}>{cfg.label}</span>;
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    orderApi.getByUser(user.id)
      .then(({ data }) => setOrders(Array.isArray(data) ? data.reverse() : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const fmt = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '—';

  if (loading) return (
    <div className="loading-center page-layout"><div className="spinner" /><p>Loading orders…</p></div>
  );

  return (
    <div className="page-layout container">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={32} /></div>
          <h3>No orders yet</h3>
          <p>Place your first order to see it here</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link to={`/orders/${order.id}`} key={order.id} className="order-card animate-fade">
              <div className="order-card-left">
                <div className="order-icon">
                  <Package size={22} />
                </div>
                <div>
                  <p className="order-id">#{order.id?.slice(0, 8).toUpperCase()}</p>
                  <p className="order-date">{fmtDate(order.createdAt)}</p>
                  <p className="order-items-count">
                    {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="order-card-right">
                <div className="order-amount">{fmt(order.totalAmount)}</div>
                <StatusBadge status={order.status} />
                <ChevronRight size={18} className="text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
