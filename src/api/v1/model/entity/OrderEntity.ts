import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    products : [
        {
            _id : {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            count : {
                type : Number
            }
        }
    ],
    totalPrice : Number,
    activeOrder : Boolean

})

const orderEntity = mongoose.model("Order", orderSchema)

export default orderEntity