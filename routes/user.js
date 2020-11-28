const router = require("express").Router(),
  { body } = require("express-validator"),
  { getUser } = require("../middleware/user"),
  { getProduct } = require("../middleware/product"),
  { isAuthenticated } = require("../middleware/authenticate"),
  { checkForConnectivity } = require("../middleware/checkForConnectivity"),
  { uploadImageUser } = require("../middleware/uploadImage-user"),
  {
    getCartProducts,
    addProductInCart,
    incrementDecrementItem,
    deleteProductFromCart,
    updateUser,
    deleteUser,
    getSpecifiedUser,
    removeAll,
  } = require("../controllers/user");

// Middleware
router.param("userId", getUser);
router.param("productId", getProduct);

//Routes
router.put(
  "/user/update/:userId",
  // checkForConnectivity,
  uploadImageUser,
  [
    body("name", "Fill all input fields").trim().notEmpty(),
    body("lastName", "Fill all input fields").trim().notEmpty(),
    body("contact")
      .notEmpty()
      .withMessage("Fill all input fields")
      .isLength({ max: 10, min: 10 })
      .withMessage("Enter valid contact number"),
    body("localAddress", "Fill all input fields").trim().notEmpty(),
    body("state", "Fill all input fields").trim().notEmpty(),
    body("city", "Fill all input fields").trim().notEmpty(),
    body("areaCode", "Fill all input fields").trim().notEmpty(),
  ],
  isAuthenticated,
  updateUser
);

router.delete(
  "/user/delete/:userId",
  checkForConnectivity,
  isAuthenticated,
  deleteUser
);

router.get("/user/:userId", isAuthenticated, getSpecifiedUser);

router.get("/cart/:userId",/*isAuthenticated,*/ getCartProducts);

router.post("/cart/addProduct/:userId",/*isAuthenticated,*/ addProductInCart);

router.get("/cart/change/:cartId/:state/:userId", isAuthenticated,incrementDecrementItem);

router.delete("/cart/:userId",isAuthenticated, deleteProductFromCart);

router.delete("/cart/removeall/:userId",isAuthenticated, removeAll);

module.exports = router;
