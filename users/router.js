const express = require("express");
const router = express.Router();

router.use(express.json());

const { User } = require("./models");

router.post("/", (req, res) => {
  const requiredFields = ["password", "email", "name"];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    console.log("Missing Field");
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "missing field",
      location: missingField
    });
  }

  const stringFields = ["password", "email", "name"];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );

  if (nonStringField) {
    console.log("nonStringField");
    return res.status(422).json({
      code: 422,
      reason: "ValicationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  const explicitlyTrimmedFields = ["email", "password"];
  const nonTrimmedField = explicitlyTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    console.log("nonTrimmedField");
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    email: {
      min: 5
    },
    password: {
      min: 10,
      max: 72
    },
    name: {
      min: 1
    }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      "min" in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );

  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      "max" in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    console.log("Field too small or too large");
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: tooSmallField
        ? `${tooSmallField} must be at least ${
            sizedFields[tooSmallField].min
          } characters long`
        : `${tooLargeField} must be at most ${
            sizedFields[tooLargeField].max
          } characters long`,
      location: tooSmallField || tooLargField
    });
  }

  let { email, password, name } = req.body;
  email = email.toLowerCase();

  return User.find({ email: email })
    .countDocuments()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Email already associated with an account",
          location: "email"
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        email,
        password: hash,
        name
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal Server Error" });
    });
});

module.exports = { router };
