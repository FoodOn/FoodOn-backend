const express = require("express"),
  router = express.Router(),
  { uploadImage } = require("../middleware/uploadImage"),
  { getProduct } = require("../middleware/product"),
  { getUser } = require("../middleware/user"),
  { isAuthenticated } = require("../middleware/authenticate"),
  {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByQuery,
    getUserProducts,
    changeAvailability,
  } = require("../controllers/product");
// Middleware
router.param("userId", getUser);
router.param("productId", getProduct);

//Routes
router.post(
  "/product/create/:userId",
  isAuthenticated,
  uploadImage,
  createProduct
);

router.put(
  "/product/update/:productId/:userId",
  isAuthenticated,
  uploadImage,
  updateProduct
);

router.delete(
  "/product/delete/:productId/:userId",
  isAuthenticated,
  deleteProduct
);

router.get("/product", getProductsByQuery);

router.get("/product/:userId", getUserProducts);

router.put(
  "/product/changeAvailability/:productId/:userId",
  isAuthenticated,
  changeAvailability
);
module.exports = router;
