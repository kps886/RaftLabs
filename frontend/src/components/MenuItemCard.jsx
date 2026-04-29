import { useCart } from '../context/CartContext';

const MenuItemCard = ({ item }) => {
  const { cart, addItem } = useCart();
  const inCart = cart.find(i => i._id === item._id);

  return (
    <div className="menu-card">
      <img src={item.imageUrl} alt={item.name} />
      <div className="card-body">
        <span className="category-badge">{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="card-footer">
          <span className="price">${item.price.toFixed(2)}</span>
          <button
            className={`add-btn ${inCart ? 'in-cart' : ''}`}
            onClick={() => addItem(item)}
          >
            {inCart ? `In Cart (${inCart.quantity})` : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;