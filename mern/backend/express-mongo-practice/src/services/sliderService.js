const Slider = require("../models/Slider");

const getSliderList = async () => {
  const sliders = await Slider.find({ status: "active" }).select(
    "title description image"
  );

  return sliders;
};

module.exports = {
  getSliderList,
};