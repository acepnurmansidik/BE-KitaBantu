const express = require("express");
const router = express.Router();
const authUserRouter = require("../resource/app/auth/router");
const categoryRouter = require("../resource/app/category/router");
const roleRouter = require("../resource/app/roles/router");
const masterBankRouter = require("../resource/app/bank/router");
const campaignouter = require("../resource/app/campaign/router");
const {
  AuthorizeUserLogin,
  RolesAccess,
} = require("../resource/middleware/authentication");

router.use(`/auth`, authUserRouter);
router.use(`/campaign`, campaignouter);
router.use(AuthorizeUserLogin);
router.use(`/category`, categoryRouter);
router.use(`/role`, roleRouter);
router.use(`/bank`, masterBankRouter);

module.exports = router;
