import { Router } from 'express';
import { Product } from '../models/Product.model';

const router = Router();

// @route   GET /api/search?q=
router.get('/', async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
      status: 'active',
    })
      .populate('brand', 'name')
      .select('name slug images price brand category')
      .limit(Number(limit));

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

export default router;
