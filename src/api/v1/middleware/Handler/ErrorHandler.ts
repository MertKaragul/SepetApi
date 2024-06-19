import { Request, Response,NextFunction } from "express";
import ResponseModel from "../../model/response/ResponseModel";

export default function(err : Error, req : Request, res : Response, next : NextFunction){
    if(err instanceof ResponseModel){
        const dto = {
            "message" : err.name,
            "status" : err.status,
            "messages": err.message 
        }
        return res.status(dto.status).json(dto)
    }else{
        const dto = {
            "message" : err.name,
            "status" : 500,
            "messages": [err.message]
        }
        return res.status(dto.status).json(dto)
    }
}