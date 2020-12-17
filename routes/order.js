const express = require("express"),
  router = express.Router(),
  { getUser } = require("../middleware/user"),
  { isAuthenticated } = require("../middleware/authenticate"),
  { placeOrders,OrderStatus,changeStatusByCheif } = require("../controllers/order");

// Middleware
router.param("userId", getUser);

//Routes
router.post("/order/place/:userId", placeOrders);
// User cheif
// status
// ?status=Pending&user=cheif
router.get('/order/user/status/:userId',OrderStatus)


// ?status:pending
router.post('/order/cheif/changestatus/:userId',changeStatusByCheif)

module.exports = router;
