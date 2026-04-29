import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

// POST /api/orders
export const placeOrder = async (req, res) => {
  try {
    const { items, deliveryDetails } = req.body;

    // Validate all menu items exist and build order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item ${item.menuItemId} not found` });
      }
      orderItems.push({
        menuItemId: menuItem._id,
        name:       menuItem.name,
        price:      menuItem.price,
        quantity:   item.quantity,
      });
      totalAmount += menuItem.price * item.quantity;
    }

    const order = await Order.create({
      items: orderItems,
      deliveryDetails,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    });

    // Emit real-time status updates (simulate progression)
    const io = req.app.get('io');
    simulateOrderProgression(order._id.toString(), io);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const validStatuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const io = req.app.get('io');
    io.to(order._id.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status:  order.status,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Helper: simulate status auto-progression ---
const simulateOrderProgression = (orderId, io) => {
  const steps = [
    { status: 'Preparing',        delay: 8000  },
    { status: 'Out for Delivery', delay: 20000 },
    { status: 'Delivered',        delay: 35000 },
  ];

  steps.forEach(({ status, delay }) => {
    setTimeout(async () => {
      try {
        const order = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
        );
        if (order) {
          io.to(orderId).emit('orderStatusUpdated', { orderId, status });
        }
      } catch (_) {}
    }, delay);
  });
};