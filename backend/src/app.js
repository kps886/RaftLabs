import express from 'express';
import cors from 'cors';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'OK' }));

export default app;