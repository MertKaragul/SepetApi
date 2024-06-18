import { Request,Response,NextFunction } from "express";
import productEntity from "../model/entity/ProductEntity";
import IProduct from "../model/interface/IProduct";
import multerService,{removeFile} from "../service/MulterService";
import ResponseModel from "../model/response/ResponseModel";
import { validationResult } from "express-validator";
import mongoose from "mongoose";


export async function getProducts(req : Request, res : Response, next : NextFunction) {
    try{
        const min = 0
        const max = 20

        const filterProducts = await productEntity.find({}).skip(min).limit(max)

        const dto = filterProducts.map(e => {
            return {
                "id" : e.id,
                "name" :e.name,
                "description" :e.description,
                "price" :e.price,
                "image" :e.image,
                "discountPrice" :e.discountPrice,
                "discountStatus" :e.discountStatus
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

        const findProduct = await productEntity.find({queryName : productInfo.name.toLowerCase().replaceAll(" ", "") })
        const images = (req.files as Array<Express.Multer.File>)

        if(findProduct.length > 0){
            images.map(e => { removeFile(e.filename) })
            throw new ResponseModel("This product already exists", 400)
        }
    
        await productEntity.create({
            name : productInfo.name,
            queryName : productInfo.name.toLowerCase().replaceAll(" ", ""),
            description : productInfo.description,
            price: productInfo.price,
            image: images.map(e => `http://localhost:3000/`+ e.path.replaceAll("\\","/")),
            createdDate : Date.now(),
            updatedDate : Date.now(),
            discountStatus : false,
            discountPrice : productInfo.discount ?? 0.0,
        })

        res.json(new ResponseModel("Product successfully added", 200))
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

        const findProduct = await productEntity.findById(new mongoose.Types.ObjectId(id))
        if(findProduct == null)
            throw new ResponseModel("Product not found", 400)


        findProduct.image.map(e => {
            removeFile(e.replace("http://localhost:3000/storage/", ""))
        })

        await findProduct.deleteOne()

        res.json(new ResponseModel("Product successfully remove", 200))
    }catch(e){
        next(e)
    }
}