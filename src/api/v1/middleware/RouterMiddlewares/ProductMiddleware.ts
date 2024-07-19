import { requiredInput } from "../Others/InputValidators";
import { accessTokenValidate } from "../Others/VerifyToken";
import { adminValidator } from "../Others/RoleValidator";
import multerService from "../../service/MulterService";
import ResponseModel from "../../model/response/ResponseModel";
import { body } from "express-validator";
import mongoose from "mongoose";


export function updateProductMiddleware(){
    return [
        accessTokenValidate,
        adminValidator,
        multerService.array("image", 5),
        requiredInput("id")
        .isLength({min : 24, max : 24})
        .withMessage("Product id must only have 24 characters")
        .isMongoId()
        .withMessage("Invalid id"),

        requiredInput("name")
        .isLength({min:3 , max : 32})
        .withMessage("Name must be between 3 and 32 characters")
        .isString()
        .withMessage("Description must be string value")
        .optional(),

        requiredInput("description")
        .isLength({min:3 , max : 32})
        .withMessage("Description must be between 3 and 32 characters")
        .isString()
        .withMessage("Description must be string value")
        .optional(),

        requiredInput("price")
        .isLength({min:1 , max : 4})
        .withMessage("Price must be between 1 and 4 characters")
        .custom(input => {
            if(input === 0 || input === undefined || input === null)
                throw new Error("Product price not be null or 0")
            return true
        })
        .optional(),

        requiredInput("discount")
        .isLength({min:1 , max : 4})
        .withMessage("Discount price must be between 1 and 4 characters")
        .isNumeric()
        .withMessage("Discount price must be numeric")
        .custom(input => {
            if(input === 0 || input === undefined || input === null)
                throw new Error("Discount price not be null or 0")
            return true
        })
        .optional()
    ]
} 

export function updateManyProductMiddleware(){
    return [
        accessTokenValidate,
        adminValidator,

        requiredInput("*.id")
        .isMongoId()
        .withMessage("Invalid id format")
        .isLength({min:24,max:24})
        .withMessage("Product id must only have 24 characters"),

        requiredInput("*.name" , "Product name not be empty")
        .optional(),

        requiredInput("*.description" , "Product description not be empty")
        .optional(),

        requiredInput("*.price" , "Product price not be empty")
        .optional(),

        requiredInput("*.discount" , "Product discount not be empty")
        .optional(),
    ]
}



export function deleteProductMiddleware(){
    return [
        accessTokenValidate,
        adminValidator,
        requiredInput("id")
        .isArray()
        .isLength({min : 24, max : 24})
        .withMessage("Product id must only have 24 characters")
    ]
}


export function deleteManyProductMiddleware(){
    return [
        accessTokenValidate,
        adminValidator,

        body()
        .isArray()
        .withMessage("Request body must be an array"),

        requiredInput("*.id")
        .isMongoId()
        .withMessage("Invalid product id")
        .isLength({min : 24, max: 24})
        .withMessage("Product id must only have 24 characters")

    ]
}


export function createProductMiddleware(){
    return[
        multerService.array("image", 5),
        accessTokenValidate,
        adminValidator,
        requiredInput("name")
        .isLength({min:3 , max : 32})
        .withMessage("Name must be between 3 and 32 characters"),

        requiredInput("description")
        .isLength({min:3 , max : 32})
        .withMessage("Description must be between 3 and 32 characters"),

        requiredInput("price")
        .isLength({min:1 , max : 4})
        .withMessage("Price must be between 1 and 4 characters")
        .custom(input => {
            if(input === 0 || input === undefined || input === null)
                throw new Error("Product price not be null or 0")
            return true
        }),

        requiredInput("discount")
        .isLength({min:1 , max : 4})
        .withMessage("Price must be between 1 and 4 characters")
        .custom(input => {
            if(input === 0 || input === undefined || input === null)
                throw new Error("Product price not be null or 0")
            return true
        })
        .optional(),

        requiredInput("categoryId")
        .isMongoId()
        .withMessage("Invalid category id")
    ]
}

export function getProductMiddleware(){
    return [
        requiredInput("id")
        .isMongoId()
        .withMessage("Product id invalid")
    ]
}
