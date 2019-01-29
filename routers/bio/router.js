"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const { jwtStrategy } = require("../../auth");
const { BioModel } = require("./models");

const jwtAuth = passport.authenticate("jwt", { session: false });

const router = express.Router();
const jsonParser = bodyParser.json();
passport.use(jwtStrategy);
router.use(jsonParser);

router.get("/", (req, res) => {
  // return res.status(200).json({ message: "You're doing your best" });
  let user = req.params.user;

  BioModel.findOne({ user: req.user })
    .then(dbres => res.status(200).json(dbres))
    .catch(err => res.status(500).json(err));
});

router.post("/", jwtAuth, (req, res) => {
  console.log(req.user);
  let testData = {
    data: req.body,
    user: req.user.id
  };

  console.log(testData);

  BioModel.create(testData)
    .then(data => {
      console.log(data);
      res.status(201).json(data);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = { router };
