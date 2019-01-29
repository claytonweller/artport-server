"use strict";
const { router } = require("./router");
const { TestModel } = require("./models");

module.exports = { router };

/* 
  For this API this is a might be a bit of a superfluous step.
  But if I have a router that gets too complicated I like to have
  space to put in extra routes on a theme.

  Also if I need to send any parts of the DB model It's nice to
  have this layer.
*/
