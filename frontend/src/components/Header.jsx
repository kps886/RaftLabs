import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { totalItems } = useCart();
  return (
    <header style={{ background: '#1a1a2e', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
        🍔 FoodDash
      </Link>
      <Link to="/checkout" style={{ color: '#fff', textDecoration: 'none' }}>
        🛒 Cart {totalItems > 0 && <span style={{ background: '#e94560', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem' }}>{totalItems}</span>}
      </Link>
    </header>
  );
};

export default Header;