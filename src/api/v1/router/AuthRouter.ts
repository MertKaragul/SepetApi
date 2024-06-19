import { Router } from "express";
import { login, profile, register, updatePassword } from "../controller/AuthController";
import { espcateInput, requiredInput } from "../middleware/Others/InputValidators";
import { accessTokenValidate } from "../middleware/Others/VerifyToken";

const authRouter = Router()

authRouter.post("/register",[
    requiredInput("username")
    .isLength({min : 3, max:12})
    .withMessage("Your name must be min 3, max 12 characters"),

    requiredInput("email")
    .isEmail()
    .withMessage("Send a validate email address"),

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

],register)


authRouter.post("/login",[
    requiredInput("email")
    .isEmail()
    .withMessage("Send a validate email address"),

    requiredInput("password")
    .isStrongPassword()
    .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length"),
],login)


authRouter.post("/updatePassword",[
    accessTokenValidate,
    requiredInput("password")
    .isStrongPassword()
    .withMessage("Password must have one uppercase,lowercase,special characters and min 8 length"),
],updatePassword)


authRouter.get("/profile",[
    accessTokenValidate,
],profile)


authRouter.put("/profile",[
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

],profile)

export default authRouter