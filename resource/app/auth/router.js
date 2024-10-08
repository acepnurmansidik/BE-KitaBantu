const express = require("express");
const controller = require("./controller");
const {
  AuthorizeUserLogin,
  AuthorizeRoleAccess,
} = require("../../middleware/authentication");
const router = express.Router();

/**
 * @route GET /users
 * @group Users - Operations about users
 * @tag Users
 * @returns {Array.<User>} 200 - An array of users
 * @returns {Error} 500 - Internal server error
 */
router.post("/sign-up", controller.Register);
router.post("/sign-in", controller.Login);
router.put("/on-refresh", AuthorizeUserLogin, controller.onRefreshTokenDevice);
router.post(
  "/submision",
  AuthorizeUserLogin,
  AuthorizeRoleAccess("Guest"),
  controller.Organizer,
);
router.put(
  "/verify/:id",
  AuthorizeUserLogin,
  AuthorizeRoleAccess("Ultramen"),
  controller.verifyOrganizer,
);

module.exports = router;
