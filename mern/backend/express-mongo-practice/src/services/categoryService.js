const Category = require("../models/Category");

const getCategoryList = async () => {
  const categories = await Category.find({ status: "active" }).select(
    "name image"
  );

  return categories;
};

module.exports = {
  getCategoryList,
};