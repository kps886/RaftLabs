const STATUSES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
const STATUS_ICONS = {
  'Order Received':   '📋',
  'Preparing':        '👨‍🍳',
  'Out for Delivery': '🛵',
  'Delivered':        '✅',
};

const OrderStatusTracker = ({ status }) => {
  const currentIndex = STATUSES.indexOf(status);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 0' }}>
      {STATUSES.map((s, i) => (
        <div key={s} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', margin: '0 auto',
            background: i <= currentIndex ? '#e94560' : '#ddd',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', transition: 'background 0.4s'
          }}>
            {STATUS_ICONS[s]}
          </div>
          {i < STATUSES.length - 1 && (
            <div style={{
              position: 'absolute', top: 24, left: '50%', width: '100%', height: 3,
              background: i < currentIndex ? '#e94560' : '#ddd', transition: 'background 0.4s'
            }} />
          )}
          <p style={{ marginTop: 8, fontSize: '0.75rem', fontWeight: i === currentIndex ? 'bold' : 'normal', color: i <= currentIndex ? '#e94560' : '#999' }}>
            {s}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTracker;