const express = require("express");
const router = express.Router();
const authUserRouter = require("../resource/app/auth/router");

router.use(`/auth`, authUserRouter);

module.exports = router;
