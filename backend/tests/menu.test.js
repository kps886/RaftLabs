import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import MenuItem from '../src/models/MenuItem.js';
import connectDB from '../src/config/db.js';

beforeAll(async () => {
  process.env.MONGO_URI = 'mongodb://localhost:27017/food-delivery-test';
  await connectDB();
  await MenuItem.deleteMany({});
  await MenuItem.insertMany([
    { name: 'Test Pizza', description: 'Tasty', price: 10, category: 'Pizza', imageUrl: 'http://img.com/1' },
    { name: 'Test Burger', description: 'Juicy', price: 8, category: 'Burgers', imageUrl: 'http://img.com/2' },
  ]);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('GET /api/menu', () => {
  it('returns all menu items with status 200', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
    expect(res.body[0]).toHaveProperty('imageUrl');
  });
});

describe('GET /api/menu/:id', () => {
  it('returns a single item by id', async () => {
    const items = await MenuItem.find();
    const res = await request(app).get(`/api/menu/${items[0]._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test Pizza');
  });

  it('returns 404 for non-existent id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/menu/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});