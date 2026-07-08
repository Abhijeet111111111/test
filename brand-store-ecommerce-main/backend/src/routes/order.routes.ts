import { Router } from 'express';
import { protect } from '../middleware/auth';
import { Order } from '../models/Order.model';

const router = Router();

// @route   POST /api/orders
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, discountAmount, totalPrice, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice,
      couponCode,
      statusHistory: [{ status: 'pending', timestamp: new Date(), note: 'Order placed' }],
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders
router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

export default router;
