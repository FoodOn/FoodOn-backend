const Product = require("../models/product"),
  { deleteImageFromAws } = require("../config/deleteImageFromAws");

module.exports.productDelete = async (profile, key, id, next) => {
  return new Promise((resolve, reject) => {
    deleteImageFromAws(key, async (err, data) => {
      try {
        if (err) {
          const err = new Error(
            `Image is not deleted from AWS, the image key is ${key}`
          );
          err.status = 500;
          throw err;
        }
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
          const err = new Error("Product not deleted");
          err.status = 400;
          throw err;
        }
        const user = profile;
        user.userProduct.pull({ _id: id });
        const saveUser = await user.save();
        if (!saveUser) {
          const err = new Error("Product not deleted form user");
          err.status = 400;
          throw err;
        }
        resolve(true);
      } catch (err) {
        if (err.status == undefined) {
          err.status = 500;
          err.message = "Something went wrong";
        }
        reject(err);
      }
    });
  });
};
