import { Request,Response,NextFunction } from "express";
import Role from "../model/enum/Role";
import ResponseModel from "../model/response/ResponseModel";


export function adminValidator(req : Request, res : Response, next : NextFunction){
    try{
        const role = res.locals["role"]
        
        if(role !== Role.ADMIN)
            throw new ResponseModel("Unauthorized", 403)

        next()
    }catch(e){
        next(e)
    }
}

export function userValidator(req : Request, res : Response, next : NextFunction){
    try{
        const role = res.locals["role"]

        if(role !== Role.ADMIN || role !== Role.USER)
            throw new ResponseModel("Unauthorized", 403)

        next()
    }catch(e){
        next(e)
    }
}