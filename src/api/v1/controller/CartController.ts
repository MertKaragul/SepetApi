import {Request,Response,NextFunction} from "express"
import { validationResult } from "express-validator"
import ResponseModel from "../model/response/ResponseModel"
import { StatusCode } from "../model/enum/StatusEnum"
import ICart from "../model/interface/ICart"
import cartModel from "../model/entity/CartEntity"
import mongoose, { connection } from "mongoose"
import productEntity from "../model/entity/ProductEntity"
import deliveryAddressModel from "../model/entity/DeliveryAddressEntity"

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
        const findUserDefaultAddress = await deliveryAddressModel.findOne({user : userId, default : true})

        if(findActiveCart == null || findActiveCart == undefined){
            await cartModel.create({
                user : userId,
                products : [
                    {
                        product : findProduct,
                        count : product.count
                    }
                ],
                deliveryAddress : findUserDefaultAddress ?? null,
                total : 0
            })
            return res.json(new ResponseModel("Product successfully added", StatusCode.SUCCESS))
        }

        const findCartProduct = findActiveCart.products.find(e => String(e.product) == String(findProduct._id))
        if(findCartProduct == undefined){
            findActiveCart.products.push({product : findProduct._id, count : product.count})
        }else{
            findActiveCart.products.remove(findCartProduct, 1)
            if(product.count != 0 )
                findActiveCart.products.push({product : findProduct, count : product.count})
        }
        
        await findActiveCart.updateOne(findActiveCart)

        res.json(new ResponseModel("Products successfully added", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}

export async function getCart(req : Request, res : Response, next : NextFunction){
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const {ordered} = req.params


        const userId = res.locals.userId
        const userCarts = await cartModel.find({user : userId, ordered : ordered ?? false})
        .populate("products.product",["_id","name","image","price","discountStatus","discountPrice"])
        .populate("deliveryAddress",["_id","name","address"])
        .lean()

        if(userCarts == null)
            throw new ResponseModel("No carts found", StatusCode.NOT_FOUND)

        const cartProducts = userCarts
        .filter(e => e.products.length > 0)
        .flatMap(e => e.products)

        const totalCartPrice = await cartProducts.reduce(async (total, productId) => {
            const product = await productEntity.findById(productId.product).exec();
            if (product) {
                return await total + ((product.discountStatus ? product.discountPrice ?? 0 : product.price) * (productId.count ?? 1));
            }
            return total;
        }, Promise.resolve(0));

        const dto = userCarts.map(e => {
            return {
                "_id" : e._id,
                "address" : e.deliveryAddress,
                "products" : e.products,
                "total" : totalCartPrice,
                "createdDate" : e.createdDate
            }
        })

        res.json(dto)
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
        const body = req.body as ICart

        if(findCart == null || findCart == undefined)
            throw new ResponseModel("We're sorry your cart empty", StatusCode.NOT_FOUND)


        const cartTotal = await findCart.products.reduce(async (total, productId) => {
            const product = await productEntity.findById(productId.product).exec();
            if (product) {
                return await total + ((product.discountStatus ? product.discountPrice ?? 0 : product.price) * (productId.count ?? 1));
            }
            return total;
        }, Promise.resolve(0));

        await findCart.updateOne({ordered : true, total : cartTotal})

        res.json(new ResponseModel("We're take your order!", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}

export async function updateCart(req : Request, res : Response, next : NextFunction) {
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)
        const userId = res.locals.userId    
        const findUserCart = await cartModel
        .findOne({user : userId, ordered : false})

        if(findUserCart == null || findUserCart == undefined)
            throw new ResponseModel("Cart not found", StatusCode.NOT_FOUND)

        const body = req.body as ICart

        findUserCart.deliveryAddress =  await deliveryAddressModel.findOne({_id : body.address}) ?? (await deliveryAddressModel.findOne({user : userId, default : true}))?.id

        findUserCart.products
        .filter(e => String(e.product) == String(body.productId))
        .map(e => {
            e.count = body.count
        })


        await findUserCart.updateOne(findUserCart)

        res.json(new ResponseModel("Product updated", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}

export async function deleteCartProduct(req : Request, res : Response, next : NextFunction) {
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const userId = res.locals.userId    
        const findUserCart = await cartModel
        .findOne({user : userId, ordered : false})

        if(findUserCart == null || findUserCart == undefined)
            throw new ResponseModel("Cart not found", StatusCode.NOT_FOUND)

        const {id} = req.params
        
        
        const findCart = findUserCart.products
        .find(value => {
            return String(value.product) == String(id)
        })

        findUserCart.products.remove(findCart,1)

        await findUserCart.updateOne(findUserCart)
        res.json(new ResponseModel("Product deleted", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}