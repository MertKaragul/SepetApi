import { Router } from "express";
import { createProduct, deleteProduct, getProducts } from "../controller/ProductController";
import multerService from "../service/MulterService";
import { body, check, param } from "express-validator";
import { requiredInput } from "../middleware/InputValidators";
const productRouter = Router()

productRouter.get("/", getProducts)
productRouter.post("/createProduct",
    multerService.array("images"),[
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

productRouter.delete("/deleteProduct/:id?", [
    requiredInput("id")
    .isLength({min : 24, max : 24})
    .withMessage("Product id must only have 24 characters")
] , deleteProduct)

export default productRouter