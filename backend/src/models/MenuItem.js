import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Pizza', 'Burgers', 'Pasta', 'Wraps', 'Salads', 'Drinks'],
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);