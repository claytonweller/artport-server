"use strict";
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const { PORT } = require("./config");

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

// app.use("/api/github/", githubRouter);
// app.use("/api/affirmation/", affirmationRouter);

app.get("/api/test", (req, res) => {
  console.log("boop");
  return res.status(200).json({ message: "it works" });
});

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(port = PORT) {
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

// Wer're exporting these for testing purposes

module.exports = { app, runServer, closeServer };
