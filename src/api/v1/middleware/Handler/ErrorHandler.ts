import { Request, Response,NextFunction } from "express";
import ResponseModel from "../../model/response/ResponseModel";

export default function(err : Error, req : Request, res : Response, next : NextFunction){
    if(err instanceof ResponseModel){
        const dto = {
            "message" : err.message,
            "status" : err.status,
            "messages": err.messages
        }

        console.log(dto)
        return res.status(dto.status).json(dto)
    }else{
        const dto = {
            "message" : err.name,
            "status" : 500,
            "messages": [err.message]
        }
        console.log(dto)
        return res.status(dto.status).json(dto)
    }
}