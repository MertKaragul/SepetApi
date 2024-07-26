import { Router } from "express";
import { addToCart, getCart, orderCart } from "../controller/CartController";
import { addToCartMiddleware } from "../middleware/RouterMiddlewares/CartMiddleware";
import { accessTokenValidate } from "../middleware/Others/VerifyToken";
const cartRouter = Router()

cartRouter.post("/", accessTokenValidate,addToCartMiddleware(),addToCart)

cartRouter.get("/", accessTokenValidate,getCart)

cartRouter.post("/order", accessTokenValidate, orderCart)



export default cartRouter