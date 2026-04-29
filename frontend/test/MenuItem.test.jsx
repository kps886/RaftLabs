import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '../src/context/CartContext';
import MenuItemCard from '../src/components/MenuItemCard';

const item = {
  _id: 'abc',
  name: 'Margherita Pizza',
  description: 'Classic pizza',
  price: 12.99,
  category: 'Pizza',
  imageUrl: 'https://img.com/pizza.jpg',
};

const renderCard = () =>
  render(<CartProvider><MenuItemCard item={item} /></CartProvider>);

describe('MenuItemCard', () => {
  it('renders item name and price', () => {
    renderCard();
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('shows add button initially', () => {
    renderCard();
    expect(screen.getByText('+ Add')).toBeInTheDocument();
  });

  it('shows in-cart label after adding', () => {
    renderCard();
    fireEvent.click(screen.getByText('+ Add'));
    expect(screen.getByText(/In Cart/)).toBeInTheDocument();
  });
});