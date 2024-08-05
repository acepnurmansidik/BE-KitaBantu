const AuthUserSchema = require("./auth");
const CategorySchema = require("./category");
const RolesSchema = require("./roles");

const GlobalSchema = { ...AuthUserSchema, ...CategorySchema, ...RolesSchema };

module.exports = GlobalSchema;
