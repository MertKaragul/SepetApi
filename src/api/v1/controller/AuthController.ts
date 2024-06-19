import { Request, Response,NextFunction } from "express";
import { validationResult } from "express-validator";
import ResponseModel from "../model/response/ResponseModel";
import userEntity from "../model/entity/UserEntity";
import IAuth from "../model/interface/IAuth";
import bcrypt from "bcrypt"
import Role from "../model/enum/Role";
import jwt from "jsonwebtoken"
import { EXPIRE_DATE, REFRESH_EXPIRE_DATE, SECRET_KEY } from "../config/TokenConfig";

export async function register(req : Request, res : Response, next : NextFunction) {
    try{
        const validateInformation = validationResult(req)
        if(!validateInformation.isEmpty())
            throw new ResponseModel("FAILED", 400, validateInformation.array().map(e => e.msg))

        const user = req.body as IAuth

        const findUser = await userEntity.findOne({email : user.email})

        if(findUser !== null)
            throw new ResponseModel("This email already using", 400)

        await userEntity.create({
            username : user.username,
            password : await bcrypt.hash(user.password, 10),
            email : user.email,
            image : "",
            role : Role.USER
        })
        res.json(new ResponseModel("Account successfully created", 200))
    }catch(e){
        next(e)
    } 
}

export async function login(req : Request, res : Response, next : NextFunction){
    try{
        const validateInformation = validationResult(req)
        if(!validateInformation.isEmpty())
            throw new ResponseModel("FAILED", 400, validateInformation.array().map(e => e.msg))

        const user = req.body as IAuth

        const findUser = await userEntity.findOne({email : user.email})
        if(findUser == null || !(await bcrypt.compare(user.password, findUser.password)))
            throw new ResponseModel("Check your email and password", 400)

        const accessToken = jwt.sign({userId : findUser._id, role : findUser.role},SECRET_KEY,{expiresIn : EXPIRE_DATE})
        const refreshToken = jwt.sign({userId : findUser._id, role : findUser.role, isRefreshKey : true},SECRET_KEY,{expiresIn : REFRESH_EXPIRE_DATE})

        res.json({accessToken, refreshToken})
    }catch(e){
        next(e)
    }
}


export async function updatePassword(req : Request, res : Response, next : NextFunction) {
    try{
        const validateInformation = validationResult(req)
        if(!validateInformation.isEmpty())
            throw new ResponseModel("FAILED", 400, validateInformation.array().map(e => e.msg))

        
        
        res.json(new ResponseModel("Password successfully updated", 200))
    }catch(e){
        next(e)
    }
}