const Cart = require("../models/cart"),
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
      for(let it of carts){
        order_item = await Order.create({
          Item: it,
          cheifId: it.cheifId,
          userId:user._id
        });
        if (!order_item) {
          const err = new Error("Order_item not created ");
          err.status = 500;
          throw err;
        }
        temp_order_items.push(order_item);

      }
      
      temp_order_items.forEach(e=>{
        user.orders_as_user.push(e)
      })
      if(!await user.save())
      {
          const err = new Error("Order cannot be not saved in user");
        err.status = 500;
        throw err;
      }
      for (const cheifId of cheifIds) {
        cheif_order = temp_order_items.filter((c) => c.cheifId == cheifId);
        cheif_user=await User.findByIdAndUpdate(cheifId,{
          $push:{orders_as_cheif:cheif_order}
        },{new:true,useFindAndModify:false})
        if(!cheif_user)
        {
          const err = new Error("Order cannot be not saved in cheif");
        err.status = 500;
        throw err;
        }
      }
      // not know why creating error
      user.cartItems.length=0
      if(! await user.save())
      {
        const err = new Error("Cart cannot be empty");
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
  // customer
  // listing product for pending and processing
  // (processing(payable):when payment is to be done)

  // cheif
  // listing product for pending,paied(order to be prepared),
  OrderStatus: async (req,res,next) =>{
      try {
        const user=req.profile
        var prop=`orders_as_${req.query.user}`
        var temp=user[prop].filter(e=>e.status==req.query.status)
        return res.json({products:temp})
      } catch (err) {
        if (err.status == undefined) {
          err.status = 500;
          err.message = "Something went wrong";
        }
        return next(err);
      }
  },
  
 
//  changing status by cheif
// processing means order is accepted
changeStatusByCheif: async (req,res,next)=>{
  try {
    const {orderId}=req.body
    
    var order=await Order.findByIdAndUpdate(orderId,{$set:{status:req.query.status}},{useFindAndModify:false})
   
    if(order)
    {
      return res.json({"message":"success"})
    }
    const err = new Error(
      "Cannot change status may be orderId is incorrect"
    );
    err.status = 400;
    throw err;
  } catch (err) {
    console.log(err);
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
 
}
  
};
