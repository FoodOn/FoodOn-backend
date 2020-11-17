const router = require("express").Router(),
  { body } = require("express-validator"),
  { getUser } = require("../middleware/user"),
  { getProduct } = require("../middleware/product"),
  { isAuthenticated } = require("../middleware/authenticate"),
  { checkForConnectivity } = require("../middleware/checkForConnectivity"),
  {
    getCartProducts,
    addProductInCart,
    incrementDecrementItem,
    deleteProductFromCart,
    updateUser,
    deleteUser,
    getSpecifiedUser,
  } = require("../controllers/user");

// Middleware
router.param("userId", getUser);
router.param("productId", getProduct);

//Routes
router.put(
  "/user/update/:userId",
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

router.get("/cart/:userId", getCartProducts);

router.post("/cart/addProduct/:userId", addProductInCart);

router.post("/cart/changeq/:cartId/:state/:userId", incrementDecrementItem);

router.delete("/cart/:cartId/:userId", deleteProductFromCart);

module.exports = router;
