const sliderService = require("../services/sliderService");

const getSliders = async (req, res) => {
  try {
    const sliders = await sliderService.getSliderList();

    res.status(200).json({
      success: true,
      message: "Slider list fetched successfully",
      data: sliders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch slider list",
      error: error.message,
    });
  }
};

module.exports = {
  getSliders,
};