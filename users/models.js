const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.methods.serialize = function() {
  return {
    id: this._id
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model("User", userSchema, "users");

module.exports = { User };