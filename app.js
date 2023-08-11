const path = require("path");

const express = require("express");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");

const connectToDB = require("./config/database");
const { errorHandler } = require("./middlewares/errors");
const { setHeaders } = require("./middlewares/headers");

//* Set ENV Config
dotenv.config({
  path: "./config/config.env",
});

//* Set Database Connection
connectToDB();

const app = express();

//* Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(fileupload());
app.use(express.json());
app.use(setHeaders);

//* Static Folders
app.use(express.static(path.join("public")));

//* Set Routes
app.use(require("./routes/router"));

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(
    `Sever is runnig (${process.env.NODE_ENV} mode) on port ${process.env.PORT}`
  )
);
