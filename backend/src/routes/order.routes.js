import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import {
  placeOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';

const router = Router();

const placeOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.menuItemId')
    .notEmpty()
    .withMessage('Each item must have a menuItemId'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Quantity must be between 1 and 20'),
  body('deliveryDetails.name')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('deliveryDetails.address')
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters'),
  body('deliveryDetails.phoneNumber')
    .isMobilePhone()
    .withMessage('Invalid phone number'),
];

router.post('/',              placeOrderValidation, validate, placeOrder);
router.get('/',               getAllOrders);
router.get('/:id',            getOrderById);
router.patch('/:id/status',   updateOrderStatus);

export default router;