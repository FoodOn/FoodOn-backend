const Cart = require("../models/cart"),
  OrderItem = require("../models/orderItem").orderItem,
  Order = require("../models/order"),
  User = require("../models/user");
//Controllers
module.exports = {
  placeOrders: async (req, res, next) => {
    try {
      const { cartIds } = req.body;
      const temp_order_items = [];
      const user=req.profile
      const carts = await Cart.find({ _id: cartIds }).populate("product");
      if (carts.length == 0) {
        const err = new Error(
          "Order should not place if products are not available in cart "
        );
        err.status = 400;
        throw err;
      }
      cheifIds_set = new Set(carts.map((cart) => cart.cheifId));
      cheifIds = Array.from(cheifIds_set);
      for(let cheifId of cheifIds){
        cheif_id_cart = carts.filter((cart) => cart.cheifId == cheifId);
        order_item = await OrderItem.create({
          Item: cheif_id_cart,
          cheifId: cheifId,
        });
        if (!order_item) {
          const err = new Error("Order_item not created ");
          err.status = 500;
          throw err;
        }
        temp_order_items.push(order_item);
        cheif = await User.findById(cheifId);
        if (!cheif) {
          const err = new Error("Cheif deleted the account");
          err.status = 400;
          throw err;
        }
        cheif.orders_as_cheif.push({
          order_item: order_item,
          address: user.localAddress,
        });
        save_cheif=await cheif.save()
        if(!save_cheif){
          const err = new Error("Cheif not saved");
          err.status = 500;
          throw err;
        }
      }
      order=await Order.create({orders:temp_order_items})
      if(!order){
        const err = new Error("Order not created ");
        err.status = 500;
        throw err;
      }
      user.orders_as_user.push(order._id)
      save_user=await user.save()
      if(!save_user){
        const err = new Error("User not saved ");
        err.status = 500;
        throw err;
      }
      return res.json({
        message:"Order placed successfully"
      })
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },
};
