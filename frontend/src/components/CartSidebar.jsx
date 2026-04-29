import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) {
    return (
      <aside className="cart-sidebar empty">
        <h2>🛒 Your Cart</h2>
        <p>Your cart is empty. Add some items!</p>
      </aside>
    );
  }

  return (
    <aside className="cart-sidebar">
      <h2>🛒 Cart ({totalItems})</h2>
      <ul className="cart-items">
        {cart.map(item => (
          <li key={item._id} className="cart-item">
            <div className="cart-item-info">
              <span>{item.name}</span>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            <div className="cart-item-controls">
              <button onClick={() => updateQty(item._id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
              <button className="remove-btn" onClick={() => removeItem(item._id)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <strong>Total: ${totalPrice.toFixed(2)}</strong>
      </div>
      <button className="checkout-btn" onClick={() => navigate('/checkout')}>
        Proceed to Checkout →
      </button>
    </aside>
  );
};

export default CartSidebar;