import { Router } from 'express';
import { Category } from '../models/Category.model';

const router = Router();

// @route   GET /api/categories
router.get('/', async (_req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/categories/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

export default router;
