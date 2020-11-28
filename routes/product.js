const express = require("express"),
  router = express.Router(),
  { uploadImageProduct } = require("../middleware/uploadImage-product"),
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
  uploadImageProduct,
  createProduct
);

router.put(
  "/product/update/:productId/:userId",
  isAuthenticated,
  uploadImageProduct,
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
