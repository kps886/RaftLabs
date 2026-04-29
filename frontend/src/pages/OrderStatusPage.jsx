import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrder } from '../api/orderApi';
import { useSocket } from '../hooks/useSocket';
import OrderStatusTracker from '../components/OrderStatusTracker';

const OrderStatusPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('Order Received');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(id)
      .then(data => { setOrder(data); setStatus(data.status); })
      .finally(() => setLoading(false));
  }, [id]);

  // Real-time socket subscription
  useSocket(id, (newStatus) => setStatus(newStatus));

  if (loading) return <div className="loading">Loading order…</div>;
  if (!order)  return <div className="error">Order not found.</div>;

  return (
    <div className="order-status-page">
      <div className="order-status-card">
        <h1>Order Tracking</h1>
        <p className="order-id">Order ID: <code>{order._id}</code></p>

        <OrderStatusTracker status={status} />

        <div className="order-details">
          <h3>Delivery To</h3>
          <p>{order.deliveryDetails.name}</p>
          <p>{order.deliveryDetails.address}</p>
          <p>{order.deliveryDetails.phoneNumber}</p>
        </div>

        <div className="order-items">
          <h3>Items Ordered</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="ordered-item">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="ordered-total">
            <strong>Total Paid:</strong>
            <strong>${order.totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        <Link to="/" className="back-btn">← Back to Menu</Link>
      </div>
    </div>
  );
};

export default OrderStatusPage;