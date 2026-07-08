import { Router } from 'express';
import { protect } from '../middleware/auth';
import { Review } from '../models/Review.model';
import { Product } from '../models/Product.model';

const router = Router();

// @route   GET /api/reviews/:productId
router.get('/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/reviews
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      title,
      comment,
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

export default router;
