const categoryService = require("../services/categoryService");

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategoryList();

    res.status(200).json({
      success: true,
      message: "Category list fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category list",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
};