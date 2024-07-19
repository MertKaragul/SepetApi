import { requiredInput } from "../Others/InputValidators";
import { accessTokenValidate } from "../Others/VerifyToken";


export function createOrderMiddleware(){
    return [
        accessTokenValidate,
        requiredInput("*.id")
        .isMongoId()
        .withMessage("Invalid product id"),
    ]
}

export function getOrdersMiddleware(){
    return [
        accessTokenValidate,
    ]
}

export function deleteOrderMiddleware(){
    return [
        accessTokenValidate,
        requiredInput("orderId")
        .isMongoId()
        .withMessage("Invalid order id")
    ]
}