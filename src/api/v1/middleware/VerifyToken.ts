import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../config/TokenConfig";
import userEntity from "../model/entity/UserEntity";
import ResponseModel from "../model/response/ResponseModel";

export async function accessTokenValidate(req : Request,res : Response, next :NextFunction){
    try{
        const getToken = req.headers.authorization?.replace("Bearer ", "") as string
        jwt.verify(getToken, SECRET_KEY)

        const decode = JSON.parse(JSON.stringify(jwt.decode(getToken)))

        const findUser = await userEntity.findOne({_id : decode["userId"] })

        if(findUser == null)
            throw new ResponseModel("User not found", 400)

        res.locals.token = getToken
        next()
    }catch(e){
        next(e)
    }
}