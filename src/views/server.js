require("dotenv").config();
const express = require("express");
const app = express();

const route = require("../routes/web.js");
const adminRoutes = require("../routes/adminRoutes.js");
const path = require("path");
const session = require("express-session");
const configViewEngine = require(path.join(
  __dirname,
  "../config/viewEngines.js"
));

//khai báo cái này thì req.body mới chạy được
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//khai bao session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "hehehe",
    resave: false,
    saveUninitialized: true,
  })
);

//khai bao routes
app.use("/", route);
app.use("/", adminRoutes);

//khai bao config
configViewEngine(app);

const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
