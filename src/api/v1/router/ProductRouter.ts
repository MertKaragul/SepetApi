import { Router } from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../controller/ProductController";
import multerService from "../service/MulterService";
import { body, check, param } from "express-validator";
import { requiredInput } from "../middleware/InputValidators";
import { accessTokenValidate } from "../middleware/VerifyToken";
import { adminValidator } from "../middleware/RoleValidator";
const productRouter = Router()

productRouter.get("/", getProducts)

productRouter.post("/create",
    multerService.array("images", 5),[
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
        .withMessage("Price must be between 1 and 4 characters"),
    ],
    createProduct
)

productRouter.delete("/delete/:id?", [
    accessTokenValidate,
    adminValidator,
    requiredInput("id")
    .isLength({min : 24, max : 24})
    .withMessage("Product id must only have 24 characters")
] , deleteProduct)

productRouter.put("/update",[
    accessTokenValidate,
    adminValidator,
    multerService.array("images", 5),

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
    .optional()

] ,updateProduct)

export default productRouter