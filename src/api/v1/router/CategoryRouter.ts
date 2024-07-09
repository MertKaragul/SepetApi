import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controller/CategoryController";
import { createCategoryMiddleware, deleteCategoryMiddleware, getCategoriesMiddleware, updateCategoryMiddleware } from "../middleware/RouterMiddlewares/CategoryMiddleware";
const categoryRouter = Router()

categoryRouter.get("/:id?", getCategoriesMiddleware() ,getCategories)

categoryRouter.post("/", createCategoryMiddleware(), createCategory)

categoryRouter.delete("/", deleteCategoryMiddleware(), deleteCategory)

categoryRouter.put("/", updateCategoryMiddleware(), updateCategory)
export default categoryRouter