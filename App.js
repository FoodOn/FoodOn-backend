// Environmental Variables
require("dotenv").config();

//Packages Require
const path = require("path"),
  express = require("express"),
  app = express(),
  { Database } = require("./config/mongodb"),
  bodyParser = require("body-parser"),
  cors = require("cors");

//Routes Require
const Auth = require("./routes/auth"),
  Product = require("./routes/product"),
  User = require("./routes/user"),
  Order = require("./routes/order");

//Mongodb config
Database(process.env.MONGODB);

// Middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "images")));

//Routes
app.use("/api", Auth);
app.use("/api", Product);
app.use("/api", User);
app.use("/api", Order);

//Error Handling
app.use((err, req, res, next) => {
  return res.status(err.status).json({
    erorr: err,
    message: err.message,
  });
});

// Server config
app.listen(process.env.PORT, () => {
  console.log(`The server is started on port ${process.env.PORT}`);
});
