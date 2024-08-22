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

router.get("/", AuthorizeRoleAccess("Organizer", "Ultramen"), controller.index);
router.post("/", AuthorizeRoleAccess("Organizer"), controller.create);
router.put("/:id", AuthorizeRoleAccess("Ultramen"), controller.update);

module.exports = router;
