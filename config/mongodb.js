const mongoose = require("mongoose");

module.exports.Database = (url) => {
  mongoose.connect("mongodb://localhost/home",
  {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
  },()=>
  {
    console.log("mongodb connected");
  });

};
