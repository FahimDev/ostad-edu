const Brand = require("../models/Brand");

const getBrandList = async () => {
  const brands = await Brand.find({ status: "active" }).select("name image");

  return brands;
};

module.exports = {
  getBrandList,
};