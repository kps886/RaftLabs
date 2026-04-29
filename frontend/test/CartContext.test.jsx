import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../src/context/CartContext';

const mockItem = { _id: '1', name: 'Pizza', price: 12.99, imageUrl: '', category: 'Pizza' };

const TestComponent = () => {
  const { cart, addItem, removeItem, updateQty, totalItems, totalPrice } = useCart();
  return (
    <div>
      <p data-testid="count">{totalItems}</p>
      <p data-testid="price">{totalPrice.toFixed(2)}</p>
      <button onClick={() => addItem(mockItem)}>Add</button>
      <button onClick={() => removeItem('1')}>Remove</button>
      <button onClick={() => updateQty('1', 3)}>Set3</button>
    </div>
  );
};

const renderWithCart = () =>
  render(<CartProvider><TestComponent /></CartProvider>);

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    renderWithCart();
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('adds an item and increments count', () => {
    renderWithCart();
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('price').textContent).toBe('12.99');
  });

  it('increments quantity when same item added twice', () => {
    renderWithCart();
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('removes an item from the cart', () => {
    renderWithCart();
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Remove'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('updates quantity of an item', () => {
    renderWithCart();
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Set3'));
    expect(screen.getByTestId('count').textContent).toBe('3');
  });
});