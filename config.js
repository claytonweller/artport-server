"use strict";
exports.PORT = process.env.PORT || 8080;
exports.ENVIRONMENT = process.env.ENVIRONMENT;
exports.DB_URL = process.env.DB_URL;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
