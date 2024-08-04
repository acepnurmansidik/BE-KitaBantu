const express = require("express");
const router = express.Router();
const authUserRouter = require("../resource/app/auth/router");
const categoryRouter = require("../resource/app/category/router");

router.use(`/auth`, authUserRouter);
router.use(`/category`, categoryRouter);

module.exports = router;
