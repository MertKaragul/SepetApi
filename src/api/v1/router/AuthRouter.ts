import { Router } from "express";
import { login, profile, register, updatePassword } from "../controller/AuthController";
import { getProfileMiddleware, loginMiddleware, registerMiddleware, updatePasswordMiddleware, updateProfileMiddleware } from "../middleware/RouterMiddlewares/AuthMiddleware";

const authRouter = Router()

authRouter.post("/register",registerMiddleware(),register)

authRouter.post("/login",loginMiddleware(),login)

authRouter.post("/updatePassword",updatePasswordMiddleware(),updatePassword)

authRouter.get("/profile",getProfileMiddleware(),profile)

authRouter.put("/profile",updateProfileMiddleware(),profile)

export default authRouter