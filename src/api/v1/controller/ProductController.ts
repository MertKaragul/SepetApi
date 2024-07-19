import { Request,Response,NextFunction } from "express";
import productEntity from "../model/entity/ProductEntity";
import IProduct from "../model/interface/IProduct";
import {fileExists, removeFile,removeFiles} from "../service/MulterService";
import ResponseModel from "../model/response/ResponseModel";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { StatusCode } from "../model/enum/StatusEnum";


export async function getProducts(req : Request, res : Response, next : NextFunction) {
    try{
        const {min, max,category,id} = req.query

        const ids = id?.toString()
        .split(",")
        .map(e => {
            try{
                return new mongoose.Types.ObjectId(e)
            }catch(_){}
        })
        .filter(e => e != undefined) ?? []
        

        const categories = category?.toString()
        .split(",")
        .map(e => {
            try{
                return new mongoose.Types.ObjectId(e)
            }catch(_){}
        })
        .filter(e => e != undefined) ?? []

        const filterProducts = await productEntity
        .find({$or: [{_id: {$in : ids}}, {category : { $in : categories}}]})
        .skip((min == undefined ) ? 0 : Number.parseInt(min.toString()))
        .limit((max == undefined ) ? 15: Number.parseInt(max.toString()))

        if(filterProducts.length <= 0)
            throw new ResponseModel("Products not found", StatusCode.NOT_FOUND)

        const dto = filterProducts.map(e => {
            return {
                "id" : e.id,
                "name" :e.name,
                "description" :e.description,
                "price" :e.price,
                "image" :e.image,
                "discountPrice" :e.discountPrice,
                "discountStatus" :e.discountStatus,
            }
        })
        res.json(dto)
    }catch(e){
        next(e)
    }
}

export async function getProduct(req : Request, res : Response, next : NextFunction) {
    try{
        const valid = validationResult(req)
        if(!valid.isEmpty())
            throw new ResponseModel("FAILED", StatusCode.BAD_REQUEST, valid.array().map(e => e.msg) )


        const {id} = req.query
        const findProduct = await productEntity.find({_id : id})

        if(findProduct == null)
            throw new ResponseModel("Product not found", 404)

        const dto = findProduct.map(e => {
            return {
                "id" : e.id,
                "name" : e.name,
                "description" : e.description,
                "price" : e.price,
                "image" : e.image,
                "discountPrice" : e.discountPrice,
                "discountStatus" : e.discountStatus,
            }
        })

        res.json(dto)
    }catch(e){
        next(e)
    }
}

export async function createProduct(req : Request, res : Response, next : NextFunction) {
    try{
        const validation = validationResult(req)
        if(!validation.isEmpty())
            throw new ResponseModel("FAILED", 400, validation.array().map(e => e.msg))

        if (!req.files || req.files.length === 0) 
            throw new ResponseModel("No images were uploaded", 400)

        const productInfo = req.body as IProduct
        const queryName = productInfo.name.generateQueryName()
        const findProduct = await productEntity.find({queryName : queryName })
        const images = (req.files as Array<Express.Multer.File>)

        if(findProduct.length > 0){
            images.map(e => { removeFile(e.filename) })
            throw new ResponseModel("This product already exists", 400)
        }
    
        await productEntity.create({
            name : productInfo.name,
            queryName : queryName,
            description : productInfo.description,
            price: productInfo.price,
            image: images.map(e => e.filename),
            createdDate : Date.now(),
            updatedDate : Date.now(),
            discountStatus : (productInfo.discount === undefined) ? 0 : productInfo.discount,
            discountPrice : (productInfo.discount === undefined) ? false : true,
            category : productInfo.categoryId
        })

        res.json(new ResponseModel("Product successfully added", 200))
    }catch(e){
        next(e)
    }
}


export async function deleteMany(req : Request, res : Response, next : NextFunction){
    try{
        const errors : string[] = []
        const ids = req.body as IProduct[]

        
        const convertObjectIds = ids.filter(e => e.id.length == 24).map(e => mongoose.Types.ObjectId.createFromHexString(e.id))

        if(convertObjectIds === undefined || convertObjectIds.length <= 0)
            throw new ResponseModel("Products not found", 400)
        
        const findedProducts = await productEntity.find( { _id : { $in : convertObjectIds } } )

        if(findedProducts !== undefined){
            findedProducts.map(e => {
                removeFiles(e.image)
                return ids.splice(ids.indexOf(e.id.toString()),1)
            })
            await productEntity.deleteMany({_id : findedProducts})
            ids.map(e => {errors.push(`${e.id} product not be found`)})
        }
    
        res.json(new ResponseModel("Products successfully deleted", 200, errors))
    }catch(e){
        next(e)
    }
}

export async function deleteProduct(req : Request, res : Response, next : NextFunction){
    try{
        const valResult = validationResult(req)
        if(!valResult.isEmpty())
            throw new ResponseModel("FAILED", 400, valResult.array().map(e => e.msg))

        const {id} = req.params

        if(id == undefined)
            throw new ResponseModel("Product id required", 400)

        await productEntity.findByIdAndDelete(new mongoose.Types.ObjectId(id))
        .catch(e => {
            throw new ResponseModel(e, 400)
        })

        res.json(new ResponseModel("Product successfully remove", 200))
    }catch(e){
        next(e)
    }
}

export async function updateProduct(req : Request, res : Response, next : NextFunction){
    try{

        const valResult = validationResult(req)
        if(!valResult.isEmpty())
            throw new ResponseModel("FAILED", 400, valResult.array().map(e => e.msg))

        const {id,name,description,price,discount,selectedImages} = req.body as IProduct

        const productDb = await productEntity.findById(id)
        
        if(productDb === undefined)
            throw new ResponseModel("Product not found", 404)

        const productImages = productDb?.image

        if(req.files != undefined){
            const images = (req.files as Array<Express.Multer.File>)
            
            if(selectedImages !== undefined){
                selectedImages.map(sImages => {
                    if(fileExists(sImages) && productImages !== undefined){
                        removeFile(sImages)
                        productImages.splice(productImages.indexOf(sImages),1)
                    }
                })
            }

            if(images !== undefined && productImages !== undefined){
                images.forEach(element => {
                    productImages.push(element.filename)
                })
            }
        }

        await productEntity.updateOne({
            image : productImages,
            name : name,
            description: description,
            price : (price === undefined || Number.parseFloat(`${price}`) === 0) ? 0 : price,
            discountPrice :  (discount === undefined || Number.parseFloat(`${discount}`) === 0) ? 0.0 : discount,
            discountStatus : (discount === undefined || Number.parseFloat(`${discount}`) === 0) ? false : true,
            queryName : name.generateQueryName()
        }).catch(e => {
            throw new ResponseModel(e, 400)
        })

        res.json(new ResponseModel("Product successfully updated", 200))
    }catch(e){
        next(e)
    }
}

export async function updateMany(req : Request, res : Response, next : NextFunction) {
    try{
        const errors : string[] = []
        const products = req.body as IProduct[]
        const productsDto = products.map(e => {
            return {
                "_id" : mongoose.Types.ObjectId.createFromHexString(e.id),
                "name" : e.name,
                "description" : e.description,
                "price" : e.price,
                "discount" : e.discount,
                "discountStatus" : (e.discount == undefined || Number.parseFloat(`${e.discount}`) === 0) ? false : true,
                "productClose" : (e.price == undefined || Number.parseFloat(`${e.price}`) === 0) ? true : false,
                "queryName" : e.name.generateQueryName()
            }
        })

        const valid = validationResult(req)
        if(!valid.isEmpty())
            throw new ResponseModel("Failed", 400, valid.array().map(e => e.msg))

        const findProducts = await productEntity.find({_id : {$in : productsDto.map(e => e._id)}})

        if(findProducts === undefined || findProducts.length <= 0)
            throw new ResponseModel("Products not found", 400)

        productsDto.map(async (e) => {
            try{
                await productEntity.updateOne(e)
            }catch(e){
                errors.push(`${e} this product cannot be updated try update later`)
            }
        })
        
        res.json(new ResponseModel("Products updated successfully", 200, errors))
    }catch(e){
        next(e)
    }
}