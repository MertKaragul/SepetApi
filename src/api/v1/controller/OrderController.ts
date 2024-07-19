import { Request,Response,NextFunction } from "express";
import orderEntity from "../model/entity/OrderEntity";
import { validationResult } from "express-validator";
import ResponseModel from "../model/response/ResponseModel";
import { StatusCode } from "../model/enum/StatusEnum";
import IOrder from "../model/interface/IOrder";
import productEntity from "../model/entity/ProductEntity";

export async function getOrders(req : Request, res : Response, next : NextFunction) {
    try{
        const valid = validationResult(req)
        if(!valid.isEmpty())
            throw new ResponseModel("FAILED", StatusCode.BAD_REQUEST, valid.array().map(e => e.msg))

        const userId = res.locals.userId

        const orders = await orderEntity.find({ user : userId })
        .populate("products._id",[
            "name",
            "image",
            "description"
        ])
        .exec()

        const dto = orders.map( e => {
            return {
                "id" : e._id,
                "products" : e.products
            }
        })

        res.json(dto)
    }catch(e){
        next(e)
    }
}

export async function createOrder(req : Request, res : Response, next : NextFunction) {
    try{

        const valid = validationResult(req)
        if(!valid.isEmpty())
            throw new ResponseModel("FAILED", StatusCode.BAD_REQUEST, valid.array().map(e => e.msg))
        
        const userId = res.locals.userId
        const body = req.body as [IOrder]

        var totalPrice : number = 0
        const findProducts = await productEntity.find({ _id : body.map(e => e.id) })
        
        if(findProducts.length <= 0)
            throw new ResponseModel("Products not found", StatusCode.SOMETHING_WENT_WRONG)
        
        findProducts
        .filter(e => e.productClose == false)
        .forEach(e => {
            totalPrice += (e.discountStatus == true ? e.discountPrice ?? 0 : e.price)
        })

        await orderEntity.create({
            user : userId,
            products : body,
            totalPrice : totalPrice,
            activeOrder : true
        })
        
        res.json(new ResponseModel("We take your order!", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}

export async function patchOrder(req : Request, res : Response, next : NextFunction) {
    try{
        const valid = validationResult(req)
        if(!valid.isEmpty())
            throw new ResponseModel("FAILED", StatusCode.BAD_REQUEST, valid.array().map(e => e.msg))
        
        const {orderId} = req.params

        const findOrder = await orderEntity.findOneAndUpdate({_id : orderId}, {activeOrder : false})

        if(findOrder == null)
            throw new ResponseModel("Order not found", StatusCode.NOT_FOUND)

        res.json(new ResponseModel("Order canceled", StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}