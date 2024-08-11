const express = require("express");
const router = express.Router();
const authUserRouter = require("../resource/app/auth/router");
const categoryRouter = require("../resource/app/category/router");
const roleRouter = require("../resource/app/roles/router");
const masterBankRouter = require("../resource/app/bank/router");
const campaignouter = require("../resource/app/campaign/router");
const uploadFileRouter = require("../resource/app/image/router");
const {
  AuthorizeUserLogin,
  RolesAccess,
} = require("../resource/middleware/authentication");

router.use(`/auth`, authUserRouter);
router.use(`/campaign`, campaignouter);
router.use(`/category`, categoryRouter);
router.use(`/bank`, masterBankRouter);
router.use(AuthorizeUserLogin);
router.use(`/upload`, uploadFileRouter);
router.use(`/role`, roleRouter);

module.exports = router;
