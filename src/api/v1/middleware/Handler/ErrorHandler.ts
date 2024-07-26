import { Request, Response,NextFunction } from "express";
import ResponseModel from "../../model/response/ResponseModel";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export default function(err : Error, req : Request, res : Response, next : NextFunction){
    if(err instanceof ResponseModel){
        const dto = {
            "message" : err.message,
            "status" : err.status,
            "messages": err.messages
        }

        console.log(dto)
        return res.status(dto.status).json(dto)
    }else if(err instanceof TokenExpiredError){
        const dto = {
            "message" : "Unauthorize",
            "status" : 401,
            "messages": "Unauthorize user"
        }
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