const mongoose=require('mongoose')


var cartSchema=new mongoose.Schema({
    quantity:Number,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    customerId:String
    
})



module.exports=mongoose.model('Cart',cartSchema) 