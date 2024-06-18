import mongoose from "mongoose";

const productModel = new mongoose.Schema({

    
    name : {
        type : String,
        required : true
    },
    image : {
        type : [String],
        required : true
    },
    description : String,
    createdDate : {
        type : Date,
        required : true
    },
    updatedDate : {
        type : Date,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    queryName : {
        type : String,
        required : true
    },
    discountPrice : Number,
    discountStatus : Boolean,
})

const productEntity = mongoose.model("Product", productModel)
export default productEntity