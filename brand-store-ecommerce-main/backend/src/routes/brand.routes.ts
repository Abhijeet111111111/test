import { Router } from 'express';
import { Brand } from '../models/Brand.model';

const router = Router();

// @route   GET /api/brands
router.get('/', async (_req, res, next) => {
  try {
    const brands = await Brand.find().sort('name');
    res.json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/brands/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    res.json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
});

export default router;
