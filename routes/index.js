const express = require("express");
const router = express.Router();
const authUserRouter = require("../resource/app/auth/router");
const categoryRouter = require("../resource/app/category/router");
const roleRouter = require("../resource/app/roles/router");
const masterBankRouter = require("../resource/app/bank/router");

router.use(`/auth`, authUserRouter);
router.use(`/category`, categoryRouter);
router.use(`/role`, roleRouter);
router.use(`/bank`, masterBankRouter);

module.exports = router;
