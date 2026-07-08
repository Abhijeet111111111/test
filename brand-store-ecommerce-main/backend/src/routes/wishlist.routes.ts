import { Router } from 'express';
import { protect } from '../middleware/auth';
import { Wishlist } from '../models/Cart.model';

const router = Router();

// @route   GET /api/wishlist
router.get('/', protect, async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wishlist
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
    } else {
      const exists = wishlist.products.some((p) => p.toString() === productId);
      if (!exists) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    wishlist = await wishlist.populate('products');
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/wishlist/:productId
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    ) as any;
    await wishlist.save();

    const populated = await wishlist.populate('products');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
});

export default router;
