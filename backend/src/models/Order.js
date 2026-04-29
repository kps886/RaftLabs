import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name:       { type: String, required: true },
  price:      { type: Number, required: true },
  quantity:   { type: Number, required: true, min: 1, max: 20 },
});

const deliveryDetailsSchema = new mongoose.Schema({
  name:        { type: String, required: true, minlength: 2 },
  address:     { type: String, required: true, minlength: 5 },
  phoneNumber: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
  items:           { type: [orderItemSchema], required: true },
  deliveryDetails: { type: deliveryDetailsSchema, required: true },
  status: {
    type: String,
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Order Received',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);