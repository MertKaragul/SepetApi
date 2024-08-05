import { escapeInput, requiredInput } from "../Others/InputValidators";
import { accessTokenValidate } from "../Others/VerifyToken";

export function addToCartMiddleware(){
    return[
        requiredInput("productId")
        .isMongoId()
        .withMessage("Invalid product id"),

        requiredInput("count")
        .isNumeric()
        .withMessage("Product count just only numeric")
    ]
}

export function updateCartMiddleware(){
    return[
        escapeInput("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .optional(),

        escapeInput("count")
        .isNumeric()
        .withMessage("Product count just only numeric")
        .optional(),

        escapeInput("address")
        .isMongoId()
        .withMessage("Invalid address type")
        .optional()
    ]
}

export function deleteCartProductMiddleware(){
    return[
        requiredInput("id")
        .isMongoId()
        .withMessage("Invalid product id")
    ]
}

