const productService = require("../services/productService");

const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const products = await productService.getProductsByCategory(category);

    res.status(200).json({
      success: true,
      message: "Products by category fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductsByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;

    const products = await productService.getProductsByBrand(brand);

    res.status(200).json({
      success: true,
      message: "Products by brand fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, image, brand, category, remark } = req.body;

    if (!name || !price || !image || !brand || !category || !remark) {
      return res.status(400).json({
        success: false,
        message:
          "Name, price, image, brand, category, and remark are required",
      });
    }

    const allowedRemarks = ["popular", "new", "top", "special", "trending"];

    if (!allowedRemarks.includes(remark)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid remark. Allowed values are popular, new, top, special, trending",
      });
    }

    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductsByCategory,
  getProductsByBrand,
  createProduct,
};