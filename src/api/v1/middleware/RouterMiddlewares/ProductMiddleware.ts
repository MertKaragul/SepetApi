import { Request,Response,NextFunction } from "express";

import { requiredInput } from "../Others/InputValidators";
import { accessTokenValidate } from "../Others/VerifyToken";
import { adminValidator } from "../Others/RoleValidator";
import multerService from "../../service/MulterService";


export async function updateProductMiddleware(req : Request, res : Response, next : NextFunction) {
    return [
        accessTokenValidate,
    adminValidator,
    multerService.array("images", 5),

    requiredInput("id")
    .isLength({min : 24, max : 24})
    .withMessage("Product id must only have 24 characters"),

    requiredInput("name")
    .isLength({min:3 , max : 32})
    .withMessage("Name must be between 3 and 32 characters")
    .optional(),

    requiredInput("description")
    .isLength({min:3 , max : 32})
    .withMessage("Description must be between 3 and 32 characters")
    .optional(),

    requiredInput("price")
    .isLength({min:1 , max : 4})
    .withMessage("Price must be between 1 and 4 characters")
    .optional(),

    requiredInput("discount")
    .isLength({min:1 , max : 4})
    .withMessage("Discount price must be between 1 and 4 characters")
    .isNumeric()
    .withMessage("Discount price must be numeric")
    .optional(),
    ]
}       