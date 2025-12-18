const express = require("express");
const path = require("path");
const configViewEngine = (app) => {
  //config viewEngines
  app.set("views", path.join(__dirname, "../views/"));
  app.set("view engine", "ejs");
  //config static file
  app.use("/users", express.static("src/public/users"));
  app.use("/admin", express.static("src/public/admin"));
  app.use("/uploads", express.static("src/public/uploads"));
};
module.exports = configViewEngine;
