const { BannerModelDefine } = require("../models/banner");

const BannerSchema = {
  BodyBannerSchema: { ...BannerModelDefine, image: "" },
};

module.exports = BannerSchema;
