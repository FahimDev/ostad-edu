const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

const llmService = require("./llm/llmService");
const {
  buildProductDescriptionPrompt,
} = require("../prompts/productDescriptionPrompt");

const productSelectFields =
  "name description price discountPrice image brand category remark stock specs status";

const getProductsByCategory = async (categoryName) => {
  const category = await Category.findOne({
    name: categoryName,
    status: "active",
  });

  if (!category) {
    return [];
  }

  const products = await Product.find({
    category: category._id,
    status: "active",
  })
    .populate("brand", "name image")
    .populate("category", "name image")
    .select(productSelectFields);

  return products;
};

const getProductsByBrand = async (brandName) => {
  const brand = await Brand.findOne({
    name: brandName,
    status: "active",
  });

  if (!brand) {
    return [];
  }

  const products = await Product.find({
    brand: brand._id,
    status: "active",
  })
    .populate("brand", "name image")
    .populate("category", "name image")
    .select(productSelectFields);

  return products;
};

const createProduct = async (payload) => {
  const brand = await Brand.findOne({
    name: payload.brand,
    status: "active",
  });

  if (!brand) {
    const error = new Error("Brand not found");
    error.statusCode = 404;
    throw error;
  }

  const category = await Category.findOne({
    name: payload.category,
    status: "active",
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const prompt = buildProductDescriptionPrompt(payload);

  let description;

  try {
    const llmResult = await llmService.generateProductDescription(prompt);
    description = llmResult.description;
  } catch (error) {
    description = `${payload.name} is a ${payload.category} product from ${payload.brand}, designed for customers looking for a reliable and practical option.`;
  }

  const product = await Product.create({
    name: payload.name,
    description,
    price: payload.price,
    discountPrice: payload.discountPrice || 0,
    image: payload.image,
    brand: brand._id,
    category: category._id,
    remark: payload.remark,
    stock: payload.stock || 0,
    specs: payload.specs || {},
    status: "active",
  });

  const populatedProduct = await Product.findById(product._id)
    .populate("brand", "name image")
    .populate("category", "name image")
    .select(productSelectFields);

  return populatedProduct;
};

module.exports = {
  getProductsByCategory,
  getProductsByBrand,
  createProduct,
};