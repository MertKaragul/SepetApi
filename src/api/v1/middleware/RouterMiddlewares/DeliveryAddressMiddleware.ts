import { requiredInput } from "../Others/InputValidators"

export function addAddressMiddleware(){
    return [
        requiredInput("name"),
        requiredInput("address"),
        requiredInput("postCode"),
        requiredInput("apartment"),
    ]
}

export function updateAddressMiddleware(){
    return [
        requiredInput("id")
        .isMongoId()
        .withMessage("Invalid address id"),

        requiredInput("address")
        .optional(),

        requiredInput("postCode")
        .optional(),
        requiredInput("apartment")
        .optional(),
    ]
}


export function deleteAddressMiddleware(){
    return [
        requiredInput("addressId")
        .isNumeric()
        .withMessage("Address ID can only be numeric parameter")
    ]
}