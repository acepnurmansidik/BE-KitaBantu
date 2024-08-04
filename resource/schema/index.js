const AuthUserSchema = require("./auth");
const CategorySchema = require("./category");

const GlobalSchema = { ...AuthUserSchema, ...CategorySchema };

module.exports = GlobalSchema;
