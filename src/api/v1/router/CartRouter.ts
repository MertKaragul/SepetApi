import { Router } from "express";
import { addToCart, getCart } from "../controller/CartController";
import { addToCartMiddleware } from "../middleware/RouterMiddlewares/CartMiddleware";
import { accessTokenValidate } from "../middleware/Others/VerifyToken";
const cartRouter = Router()

cartRouter.post("/", accessTokenValidate,addToCartMiddleware(),addToCart)
cartRouter.get("/", accessTokenValidate,getCart)


export default cartRouter