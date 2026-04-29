import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i._id === action.item._id);
      if (existing) {
        return state.map(i =>
          i._id === action.item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i._id !== action.id);
    case 'UPDATE_QTY':
      if (action.qty <= 0) return state.filter(i => i._id !== action.id);
      return state.map(i =>
        i._id === action.id ? { ...i, quantity: action.qty } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem    = (item)      => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id)        => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQty  = (id, qty)   => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart  = ()          => dispatch({ type: 'CLEAR' });

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};