import { espcateInput, requiredInput } from "../Others/InputValidators";
import { accessTokenValidate } from "../Others/VerifyToken";

export function registerMiddleware(){
    return [
        requiredInput("username")
        .isLength({min : 3, max:12})
        .withMessage("Your name must be min 3, max 12 characters"),

        requiredInput("email")
        .isEmail()
        .withMessage("Send a validate email address"),

        requiredInput("address"),

        requiredInput("phone")
        .isMobilePhone("tr-TR")
        .withMessage("Send a validate phone number"),

        requiredInput("password")
        .isStrongPassword()
        .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length"),

        requiredInput("passwordAgain")
        .isStrongPassword()
        .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length")
        .custom(async(confirmPassword,{req}) => {
            const passwordAgain = confirmPassword as string
            const password = req.body.password as string
            if(passwordAgain !== password)
                throw new Error("Passwords must be same")
        }),
    ]
}

export function loginMiddleware(){
    return [
        requiredInput("email")
        .isEmail()
        .withMessage("Send a validate email address"),

        requiredInput("password")
        .isStrongPassword()
        .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length"),
    ]
}

export function updatePasswordMiddleware(){
    return [
        accessTokenValidate,
        requiredInput("password")
        .isStrongPassword()
        .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length"),
    ]
}

export function getProfileMiddleware(){
    return[
        accessTokenValidate,
    ]
}

export function updateProfileMiddleware(){
    return[
        accessTokenValidate,
        requiredInput("username")
        .isLength({min : 3, max:12})
        .withMessage("Your name must be min 3, max 12 characters")
        .optional(),
    
        espcateInput("email")
        .isEmail()
        .withMessage("Send a validate email address")
        .optional(),
    
        espcateInput("password")
        .isStrongPassword()
        .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length")
        .optional(),
    
        requiredInput("passwordAgain")
        .optional()
        .isStrongPassword()
        .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length")
        .custom(async(confirmPassword,{req}) => {
            const passwordAgain = confirmPassword as string
            const password = req.body.password as string
            if(passwordAgain !== password)
                throw new Error("Passwords must be same")
        }),
    ]
}