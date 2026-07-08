import { Router } from "express";
import { Product } from "../models/Product.model";

const router = Router();

// @route   GET /api/products
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = "-createdAt",
      category,
      brand,
      minPrice,
      maxPrice,
      color,
      size,
      rating,
      search,
      isFeatured,
      isNewArrival,
      isBestSeller,
      isOnSale,
      gender,
    } = req.query;

    const query: any = { status: "active" };

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (color) query["colors.name"] = { $regex: color, $options: "i" };
    if (size) query["sizes.size"] = size;
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) query.$text = { $search: search as string };
    if (isFeatured) query.isFeatured = isFeatured === "true";
    if (isNewArrival) query.isNewArrival = isNewArrival === "true";
    if (isBestSeller) query.isBestSeller = isBestSeller === "true";
    if (isOnSale) query.isOnSale = isOnSale === "true";
    if (gender) query.gender = gender;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("brand", "name slug logo")
      .populate("category", "name slug")
      .sort(sort as string)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("brand", "name slug logo")
      .populate("category", "name slug");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

export default router;
