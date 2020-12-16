const express = require("express"),
  router = express.Router(),
  { getUser } = require("../middleware/user"),
  { isAuthenticated } = require("../middleware/authenticate"),
  { placeOrders } = require("../controllers/order");

// Middleware
router.param("userId", getUser);

//Routes
router.post("/order/place/:userId", isAuthenticated, placeOrders);

module.exports = router;
