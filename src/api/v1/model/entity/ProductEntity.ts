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
    discountPrice : {
        type : Number,
        required : false,
        default : 0
    },
    discountStatus : {
        type : Boolean,
        required : false,
        default : false
    },
    productClose : {
        type : Boolean,
        required : true,
        default : false
    },
    category : {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    }
})

const productEntity = mongoose.model("Product", productModel)
export default productEntity