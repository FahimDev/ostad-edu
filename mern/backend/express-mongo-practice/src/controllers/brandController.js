const brandService = require("../services/brandService");

const getBrands = async (req, res) => {
  try {
    const brands = await brandService.getBrandList();

    res.status(200).json({
      success: true,
      message: "Brand list fetched successfully",
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch brand list",
      error: error.message,
    });
  }
};

module.exports = {
  getBrands,
};