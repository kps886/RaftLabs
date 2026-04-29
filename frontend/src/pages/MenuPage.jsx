import { useState, useEffect, useMemo } from 'react';
import { fetchMenu } from '../api/menuApi';
import MenuItemCard from '../components/MenuItemCard';
import CartSidebar from '../components/CartSidebar';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenu()
      .then(setMenuItems)
      .catch(() => setError('Failed to load menu. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map(i => i.category))];
    return ['All', ...cats];
  }, [menuItems]);

  const filtered = useMemo(() =>
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter(i => i.category === activeCategory),
    [menuItems, activeCategory]
  );

  if (loading) return <div className="loading">Loading menu…</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="menu-layout">
      <main className="menu-main">
        <h1>Our Menu</h1>
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={activeCategory === cat ? 'active' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="menu-grid">
          {filtered.map(item => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      </main>
      <CartSidebar />
    </div>
  );
};

export default MenuPage;