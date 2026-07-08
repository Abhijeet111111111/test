import { Router } from 'express';
import { protect } from '../middleware/auth';
import { Cart } from '../models/Cart.model';

const router = Router();

// @route   GET /api/cart
router.get('/', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/cart
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, size, color, quantity, price } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, size, color, quantity, price }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, size, color, quantity: quantity || 1, price });
      }
      await cart.save();
    }

    // Recalculate total
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();

    cart = await cart.populate('items.product');
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/cart/:itemId
router.put('/:itemId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(
  (item: any) => item._id.toString() === req.params.itemId
);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    item.quantity = req.body.quantity;
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();

    const populated = await cart.populate('items.product');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/:itemId
router.delete('/:itemId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(
  (item: any) => item._id?.toString() !== req.params.itemId
) as any;
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();

    const populated = await cart.populate('items.product');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
});

export default router;
