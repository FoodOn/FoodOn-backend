const mongoose = require("mongoose");

module.exports.Database = (url) => {
  mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("error in connecting to DB");
  });

};
