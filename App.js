// Environmental Variables
require("dotenv").config();

//Packages Require
const path = require("path"),
  express = require("express"),
  app = express(),
  { Database } = require("./config/mongodb"),
  bodyParser = require("body-parser");

//Routes Require
const Auth = require("./routes/Auth");

//Mongodb config
Database(process.env.MONGODB);

// Middlewares
app.use(bodyParser.json());

//Routes
app.use("/api", Auth);

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
