"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

const { PORT, DB_URL } = require("./config");
const { router: bioRouter } = require("./routers/bio");
const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");
const { router: userRouter } = require("./users");

const app = express();

// Logging
app.use(morgan("common"));

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/bio/", bioRouter);
app.use("/api/user/", userRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.get("/api/test", (req, res) => {
  return res.status(200).json({ message: "it works" });
});

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }

        server = app
          .listen(port, () => {
            console.log("App is Listening on Port " + port);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

const closeServer = () => {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing Server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};

if (require.main === module) {
  runServer(DB_URL, PORT).catch(err => console.error(err));
}

// Wer're exporting these for testing purposes

module.exports = { app, runServer, closeServer };
