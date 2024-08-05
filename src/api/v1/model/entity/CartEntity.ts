import mongoose,{ model, Schema, } from "mongoose";

const cartScheme = new Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    
    products: [
        {
            product : {
                type : mongoose.Types.ObjectId,
                ref : "Product"
            },
            count : Number
        }
    ],
    
    createdDate : {
        type: Date,
        default : Date.now()
    },
    
    ordered : {
        type: Boolean,
        default : false
    },

    total : Number,

    deliveryAddress : {
        type : mongoose.Types.ObjectId,
        ref : "DeliveryAddress"
    }

})

const cartModel = model("Cart", cartScheme)

export default cartModel