const express = require("express");
const controller = require("./controller");
const { globalFunc } = require("../../helper/global-func");
const uploadFileConfig = require("../../middleware/multer");
const uploadMiddlewareFile = require("../../middleware/multer");
const { AuthorizeRoleAccess } = require("../../middleware/authentication");

const router = express.Router();

/**
 * @route GET /users
 * @group Users - Operations about users
 * @tag Users
 * @apiParam {file} file File to upload
 * @returns {Array.<User>} 200 - An array of users
 * @returns {Error} 500 - Internal server error
 */

router.use(AuthorizeRoleAccess("Organizer"));
router.put("/", uploadMiddlewareFile, controller.uploadFile);

module.exports = router;
