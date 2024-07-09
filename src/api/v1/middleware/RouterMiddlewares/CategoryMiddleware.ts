import multerService from "../../service/MulterService";
import { espcateInput, requiredInput } from "../Others/InputValidators";
import { adminValidator } from "../Others/RoleValidator";
import { accessTokenValidate } from "../Others/VerifyToken";

export function getCategoriesMiddleware(){
    return[
        requiredInput("id")
        .isMongoId()
        .withMessage("Invalid category id")
        .optional()
    ]
}


export function createCategoryMiddleware(){
    return[
        accessTokenValidate,
        adminValidator,
        multerService.single("image"),
        requiredInput("name"),
    ]
}

export function deleteCategoryMiddleware(){
    return[
        accessTokenValidate,
        adminValidator,
        requiredInput("id")
        .isMongoId()
        .withMessage("Invalid category id"),
    ]
}

export function updateCategoryMiddleware(){
    return[
        accessTokenValidate,
        adminValidator,
        multerService.single("image"),
        requiredInput("id")
        .isMongoId()
        .withMessage("Invalid category id"),
        
        espcateInput("name")
    ]
}