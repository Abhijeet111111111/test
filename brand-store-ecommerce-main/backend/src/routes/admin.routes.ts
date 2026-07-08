import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { Product } from '../models/Product.model';
import { Order } from '../models/Order.model';
import { User } from '../models/User.model';
import { Brand } from '../models/Brand.model';
import { Category } from '../models/Category.model';
import { Coupon } from '../models/Coupon.model';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
router.get('/dashboard', async (_req, res, next) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalRevenue] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(10);

    // Monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
        monthlyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Admin CRUD - Products
router.post('/products', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
});

// Admin CRUD - Brands
router.post('/brands', async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
});

router.put('/brands/:id', async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
});

router.delete('/brands/:id', async (req, res, next) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
});

// Admin CRUD - Categories
router.post('/categories', async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

router.delete('/categories/:id', async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

// Admin - Orders management
router.get('/orders', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query: any = {};
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    next(error);
  }
});

router.put('/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const { status, trackingNumber } = req.body;
    if (status) {
      order.status = status;
      order.statusHistory.push({ status, timestamp: new Date(), note: `Status updated to ${status}` });
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// Admin - Users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// Admin CRUD - Coupons
router.get('/coupons', async (_req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
});

router.post('/coupons', async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
});

router.put('/coupons/:id', async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
});

router.delete('/coupons/:id', async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
