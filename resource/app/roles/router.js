const express = require("express");
const controller = require("./controller");
const router = express.Router();

/**
 * @route GET /users
 * @group Users - Operations about users
 * @tag Users
 * @returns {Array.<User>} 200 - An array of users
 * @returns {Error} 500 - Internal server error
 */
router.get("/", controller.index);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
