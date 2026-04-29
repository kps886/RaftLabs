import 'dotenv/config';
import mongoose from 'mongoose';
import MenuItem from './src/models/MenuItem.js';
import connectDB from './src/config/db.js';

const menuItems = [
  { name: 'Margherita Pizza',   description: 'Classic tomato sauce, fresh mozzarella, basil',            price: 12.99, category: 'Pizza',   imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500' },
  { name: 'Pepperoni Pizza',    description: 'Spicy pepperoni, mozzarella, tangy tomato',                price: 14.99, category: 'Pizza',   imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },
  { name: 'BBQ Chicken Burger', description: 'Grilled chicken, smoky BBQ sauce, crispy coleslaw',       price: 9.99,  category: 'Burgers', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
  { name: 'Classic Cheeseburger', description: 'Beef patty, cheddar, lettuce, tomato, pickles',         price: 8.99,  category: 'Burgers', imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500' },
  { name: 'Pasta Carbonara',    description: 'Creamy egg sauce, crispy pancetta, parmesan',              price: 13.49, category: 'Pasta',   imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500' },
  { name: 'Penne Arrabbiata',   description: 'Spicy tomato sauce, garlic, fresh chilli',                price: 11.99, category: 'Pasta',   imageUrl: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=500' },
  { name: 'Caesar Salad',       description: 'Romaine, croutons, parmesan, Caesar dressing',            price: 7.99,  category: 'Salads',  imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500' },
  { name: 'Veggie Wrap',        description: 'Grilled veggies, hummus, feta, warm tortilla',            price: 8.49,  category: 'Wraps',   imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500' },
];

const seedDB = async () => {
  await connectDB();
  await MenuItem.deleteMany({});
  await MenuItem.insertMany(menuItems);
  console.log('✅ Database seeded successfully!');
  await mongoose.disconnect();
};

seedDB();