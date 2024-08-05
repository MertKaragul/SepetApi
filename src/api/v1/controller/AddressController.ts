import { Request,Response,NextFunction } from "express"
import { StatusCode } from "../model/enum/StatusEnum"
import ResponseModel from "../model/response/ResponseModel"
import { validationResult } from "express-validator"
import DeliveryAddressModel from "../model/entity/DeliveryAddressEntity"
import IDeliveryAddress from "../model/interface/IDeliveryAddress"
import mongoose from "mongoose"


export async function getAddress(req : Request, res : Response, next : NextFunction) {
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const userId = res.locals.userId
        const findAddress = await DeliveryAddressModel.find({user : userId})

        const dto = findAddress.map(e => {
            return {
                "_id" : e.id,
                "name" : e.name,
                "address" : e.address,
                "postCode" : e.postCode,
                "apartment" : e.apartment
            }
        })

        return res.json(dto)
    }catch(e){
        next(e)
    }
}



export async function addAddress(req : Request, res : Response, next : NextFunction) {
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const userId = res.locals.userId
        const address = req.body as IDeliveryAddress

        const findUserAddresses = await DeliveryAddressModel.find({user : userId})
        if(findUserAddresses.length == 5)
            throw new ResponseModel("You just only add max 5 address", StatusCode.BAD_REQUEST)

        await DeliveryAddressModel.create({
            user: userId,
            name : address.name,
            address : address.address,
            postCode : address.postCode,
            apartment : address.apartment,
            default : (findUserAddresses.length == 0) ? true : false
        })
        
        res.json(new ResponseModel("Address successfully added",StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}

export async function updateAddress(req : Request, res : Response, next : NextFunction) {
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const userId = res.locals.userId
        const address = req.body as IDeliveryAddress

        const dbAddress = await DeliveryAddressModel.findOne({_id : address.id,user : userId})
        if(dbAddress == null || dbAddress == undefined){
            throw new ResponseModel("Adress not found", StatusCode.NOT_FOUND)
        }


        await dbAddress?.updateOne(address) 

        res.json(new ResponseModel("Address successfully updated",StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}


export async function deleteAddress(req : Request, res : Response, next : NextFunction) {
    try{
        const validate = validationResult(req)
        if(!validate.isEmpty())
            throw new ResponseModel(validate.array().map(e => e.msg)[0], StatusCode.BAD_REQUEST)

        const userId = res.locals.userId
        const {id} = req.params
        
        const dbAddress = await DeliveryAddressModel.findOne({_id : id, user : userId})
        if(dbAddress == null || dbAddress == undefined){
            throw new ResponseModel("Adress not found", StatusCode.NOT_FOUND)
        }

        await dbAddress.deleteOne()

        res.json(new ResponseModel("Address successfully deleted",StatusCode.SUCCESS))
    }catch(e){
        next(e)
    }
}
