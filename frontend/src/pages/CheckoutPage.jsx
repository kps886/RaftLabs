import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orderApi';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    address: '',
    phoneNumber: '',
  });

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2)       errs.name        = 'Name must be at least 2 characters';
    if (!form.address || form.address.length < 5)  errs.address     = 'Address must be at least 5 characters';
    if (!form.phoneNumber)                          errs.phoneNumber = 'Phone number is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (cart.length === 0) { alert('Your cart is empty!'); return; }

    setLoading(true);
    try {
      const payload = {
        items: cart.map(i => ({ menuItemId: i._id, quantity: i.quantity })),
        deliveryDetails: form,
      };
      const order = await placeOrder(payload);
      clearCart();
      navigate(`/order-status/${order._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-layout">
      <div className="checkout-form-container">
        <h1>Checkout</h1>
        <form onSubmit={handleSubmit} className="checkout-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={form.name}
              onChange={handleChange} placeholder="John Doe" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <input id="address" name="address" value={form.address}
              onChange={handleChange} placeholder="123 Main Street, City" />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input id="phoneNumber" name="phoneNumber" value={form.phoneNumber}
              onChange={handleChange} placeholder="+91 98765 43210" />
            {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
          </div>
          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Placing Order…' : `Place Order · $${totalPrice.toFixed(2)}`}
          </button>
        </form>
      </div>

      <aside className="order-summary">
        <h2>Order Summary</h2>
        {cart.map(item => (
          <div key={item._id} className="summary-row">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-total">
          <strong>Total</strong>
          <strong>${totalPrice.toFixed(2)}</strong>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutPage;