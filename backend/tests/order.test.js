import request from 'supertest';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from '../src/app.js';
import MenuItem from '../src/models/MenuItem.js';
import Order from '../src/models/Order.js';
import connectDB from '../src/config/db.js';

let server, io, menuItemId;

beforeAll(async () => {
  process.env.MONGO_URI = 'mongodb://localhost:27017/food-delivery-orders-test';
  await connectDB();

  // Setup mock socket.io
  server = http.createServer(app);
  io = new Server(server);
  app.set('io', io);

  await MenuItem.deleteMany({});
  await Order.deleteMany({});

  const item = await MenuItem.create({
    name: 'Burger', description: 'Beef burger', price: 9.99,
    category: 'Burgers', imageUrl: 'http://img.com/b',
  });
  menuItemId = item._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  server.close();
});

const validOrderPayload = () => ({
  items: [{ menuItemId, quantity: 2 }],
  deliveryDetails: {
    name: 'Jane Doe',
    address: '123 Main Street',
    phoneNumber: '+919876543210',
  },
});

describe('POST /api/orders', () => {
  it('places an order successfully and returns 201', async () => {
    const res = await request(app).post('/api/orders').send(validOrderPayload());
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.status).toBe('Order Received');
    expect(res.body.totalAmount).toBe(19.98);
  });

  it('returns 400 when items array is empty', async () => {
    const payload = { ...validOrderPayload(), items: [] };
    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when delivery name is too short', async () => {
    const payload = validOrderPayload();
    payload.deliveryDetails.name = 'A';
    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when phone number is invalid', async () => {
    const payload = validOrderPayload();
    payload.deliveryDetails.phoneNumber = '123';
    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when menuItemId does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const payload = { ...validOrderPayload(), items: [{ menuItemId: fakeId, quantity: 1 }] };
    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/orders/:id', () => {
  it('fetches an order by id', async () => {
    const postRes = await request(app).post('/api/orders').send(validOrderPayload());
    const orderId = postRes.body._id;

    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(orderId);
  });

  it('returns 404 for unknown order id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/orders/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /api/orders/:id/status', () => {
  it('updates order status successfully', async () => {
    const postRes = await request(app).post('/api/orders').send(validOrderPayload());
    const orderId = postRes.body._id;

    const res = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .send({ status: 'Preparing' });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('Preparing');
  });

  it('returns 400 for invalid status value', async () => {
    const postRes = await request(app).post('/api/orders').send(validOrderPayload());
    const res = await request(app)
      .patch(`/api/orders/${postRes.body._id}/status`)
      .send({ status: 'Flying' });
    expect(res.statusCode).toBe(400);
  });
});