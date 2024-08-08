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
router.post("/singup", controller.Register);
router.post("/signin", controller.Login);
router.put("/on-refresh", AuthorizeUserLogin, controller.onRefreshTokenDevice);
router.post(
  "/submision",
  AuthorizeUserLogin,
  AuthorizeRoleAccess("Ultramen"),
  controller.Organizer,
);
router.put(
  "/verify/:id",
  AuthorizeUserLogin,
  AuthorizeRoleAccess("Ultramen"),
  controller.verifyOrganizer,
);

module.exports = router;
