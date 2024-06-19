import  { check, ValidationChain } from "express-validator"

export function requiredInput(
    value : string, 
    message : string = `${value} is required`
) : ValidationChain{
    return check(value)
    .notEmpty()
    .withMessage(message)
    .escape()
    .trim()
}

export function espcateInput(
    value : string, 
) : ValidationChain{
    return check(value)
    .escape()
    .trim()
}