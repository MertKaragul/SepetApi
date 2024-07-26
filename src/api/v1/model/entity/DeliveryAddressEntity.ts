import mongoose from "mongoose";

const deliveryAddressScheme = new mongoose.Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    name : String,
    address : String,
    postCode : Number,
    apartment : Number,
    default : Boolean

})

const deliveryAddressModel = mongoose.model("DeliveryAddress",deliveryAddressScheme)
export default deliveryAddressModel