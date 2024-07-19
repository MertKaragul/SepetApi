import {Request,Response,NextFunction} from "express"
import { validationResult } from "express-validator"
import ResponseModel from "../model/response/ResponseModel"
import { StatusCode } from "../model/enum/StatusEnum"
import ICart from "../model/interface/ICart"
import cartModel from "../model/entity/CartEntity"
import mongoose from "mongoose"
import productEntity from "../model/entity/ProductEntity"

export async function addToCart(req : Request, res : Response, next : NextFunction) {
    try{
        
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel("FAILED", StatusCode.BAD_REQUEST, validate.array().map(e => e.msg))

        const product = req.body as ICart
        const userId = res.locals.userId
        if(product == null)
            throw new ResponseModel("No product selected", StatusCode.BAD_REQUEST)

        const findProduct = await productEntity.findOne({_id : new mongoose.Types.ObjectId(product.productId.toString()) })
        if(findProduct == null)
            throw new ResponseModel("Product not found", StatusCode.NOT_FOUND)

        const findActiveCart = await cartModel.findOne({ordered : true})

        if(findActiveCart == null){
            await cartModel.create({
                userId : userId,
                products : [
                    {
                        product : findProduct,
                        count : product.count
                    }
                ]
            })
            throw new ResponseModel("Product successfully added", StatusCode.SUCCESS)
        }


        // Update cart
        const findCartProduct = findActiveCart.products.find(e => String(e.product) == String(findProduct._id))
        if(findCartProduct == null){
            findActiveCart.products.push({product : findProduct, count : product.count})
        }else{
            findActiveCart.products.remove(findCartProduct, 1)
            if(product.count != 0 )
                findActiveCart.products.push({product : findProduct, count : product.count})
        }

        await cartModel.findOneAndUpdate({
            ordered : true
        },findActiveCart)

        res.json(new ResponseModel("Products successfully added", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}

export async function getCart(req : Request, res : Response, next : NextFunction){
    try{
        const userId = res.locals.userId
        console.log(userId)
        const userCarts = await cartModel.find({userId : userId})
        .populate("products.product",["_id","name","image","description","price","discountStatus","discountPrice"])
        res.json(userCarts)
    }catch(e){
        next(e)
    }
}
