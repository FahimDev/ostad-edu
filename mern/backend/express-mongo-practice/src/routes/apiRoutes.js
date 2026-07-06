const express = require("express");

const brandController = require("../controllers/brandController");
const categoryController = require("../controllers/categoryController");
const sliderController = require("../controllers/sliderController");
const productController = require("../controllers/productController");
const { productCreateLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product with AI-generated description
 *     tags: [Products]
 *     description: Creates a product and automatically generates a short product description using an LLM.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - image
 *               - brand
 *               - category
 *               - remark
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 16 Pro
 *               price:
 *                 type: number
 *                 example: 1350
 *               discountPrice:
 *                 type: number
 *                 example: 1250
 *               image:
 *                 type: string
 *                 example: iphone-16-pro.png
 *               brand:
 *                 type: string
 *                 example: Apple
 *               category:
 *                 type: string
 *                 example: Smartphone
 *               remark:
 *                 type: string
 *                 enum: [popular, new, top, special, trending]
 *                 example: new
 *               stock:
 *                 type: number
 *                 example: 30
 *               specs:
 *                 type: object
 *                 properties:
 *                   storage:
 *                     type: string
 *                     example: 256GB
 *                   color:
 *                     type: string
 *                     example: Natural Titanium
 *                   battery:
 *                     type: string
 *                     example: Long-lasting battery
 *                   warranty:
 *                     type: string
 *                     example: 1 Year
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Brand or category not found
 *       429:
 *         description: Too many requests
 */
router.post(
  "/products",
  productCreateLimiter,
  productController.createProduct
);

/**
 * @swagger
 * tags:
 *   - name: Brands
 *     description: Brand related APIs
 *   - name: Categories
 *     description: Category related APIs
 *   - name: Sliders
 *     description: Slider related APIs
 *   - name: Products
 *     description: Product related APIs
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all active brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Brand list fetched successfully
 */
router.get("/brands", brandController.getBrands);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all active categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Category list fetched successfully
 */
router.get("/categories", categoryController.getCategories);

/**
 * @swagger
 * /api/sliders:
 *   get:
 *     summary: Get all active sliders
 *     tags: [Sliders]
 *     responses:
 *       200:
 *         description: Slider list fetched successfully
 */
router.get("/sliders", sliderController.getSliders);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         example: Smartphone
 *         description: Category name
 *     responses:
 *       200:
 *         description: Products by category fetched successfully
 */
router.get(
  "/products/category/:category",
  productController.getProductsByCategory
);

/**
 * @swagger
 * /api/products/brand/{brand}:
 *   get:
 *     summary: Get products by brand
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: brand
 *         required: true
 *         schema:
 *           type: string
 *         example: Apple
 *         description: Brand name or brand id depending on your service implementation
 *     responses:
 *       200:
 *         description: Products by brand fetched successfully
 */
router.get("/products/brand/:brand", productController.getProductsByBrand);

module.exports = router;