const router = require("express").Router();
const {
  getCartProducts,
  addProductInCart,
  incrementDecrementItem,
  deleteProductFromCart,
} = require("../controllers/user");
const { getUser } = require("../middleware/user"),
      { getProduct } = require("../middleware/product")

router.param("userId", getUser);
router.param("productId", getProduct);


router.get("/cart/:userId", getCartProducts);

router.post("/cart/addProduct/:userId", addProductInCart);

router.get("/cart/changeq/:cartId/:state/:userId", incrementDecrementItem);

router.delete("/cart/:cartId/:userId", deleteProductFromCart);

module.exports = router;
