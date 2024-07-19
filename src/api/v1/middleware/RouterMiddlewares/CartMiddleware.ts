import { requiredInput } from "../Others/InputValidators";

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