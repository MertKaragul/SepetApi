import { Router } from "express";
import { createProduct, deleteMany, deleteProduct, getProducts, updateProduct, updateMany, getProduct } from "../controller/ProductController";
import { createProductMiddleware, deleteManyProductMiddleware, deleteProductMiddleware, getProductMiddleware, updateManyProductMiddleware, updateProductMiddleware } from "../middleware/RouterMiddlewares/ProductMiddleware";
const productRouter = Router()

productRouter.get("/",getProducts)

productRouter.post("/create",createProductMiddleware(),createProduct)

productRouter.get("/", getProductMiddleware() , getProduct)

productRouter.delete("/delete/:id?", deleteProductMiddleware(),deleteProduct)

productRouter.delete("/deleteMany", deleteManyProductMiddleware(),deleteMany)

productRouter.put("/update", updateProductMiddleware(),updateProduct)

productRouter.put("/updateMany", updateManyProductMiddleware(),updateMany)

export default productRouter