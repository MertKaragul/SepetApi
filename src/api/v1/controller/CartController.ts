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
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const product = req.body as ICart
        const userId = res.locals.userId
        if(product == null)
            throw new ResponseModel("No product selected", StatusCode.BAD_REQUEST)

        const findProduct = await productEntity.findOne({_id : new mongoose.Types.ObjectId(product.productId.toString()) })
        if(findProduct == null)
            throw new ResponseModel("Product not found", StatusCode.NOT_FOUND)

        const findActiveCart = await cartModel.findOne({ordered : false})

        if(findActiveCart == null){
            await cartModel.create({
                user : userId,
                products : [
                    {
                        product : findProduct,
                        count : product.count
                    }
                ]
            })
            throw new ResponseModel("Product added", StatusCode.SUCCESS)
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
            ordered : false
        },findActiveCart)

        res.json(new ResponseModel("Products successfully added", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}

export async function getCart(req : Request, res : Response, next : NextFunction){
    try{
        const userId = res.locals.userId
        const userCarts = await cartModel.find({user : userId})
        .populate("products.product",["_id","name","image","description","price","discountStatus","discountPrice"])


        res.json(userCarts)
    }catch(e){
        next(e)
    }
}


export async function orderCart(req : Request, res : Response, next : NextFunction) {
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const userId = res.locals.userId
        const findCart = await cartModel.findOne({user : userId, ordered : false})

        if(findCart == null || findCart == undefined)
            throw new ResponseModel("We're sorry your cart empty", StatusCode.NOT_FOUND)

        await findCart.updateOne({ordered : true})

        res.json(new ResponseModel("We're take your order!", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}