import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";
import {permissionsIsAdmin} from "../middlewares/permissions.midddleware.js";
import { passportCall } from "../util.js";

const router = Router()

router.get('/', getProducts)
router.get('/:pid', getProductById)
router.post('/', passportCall("jwtStrat"), permissionsIsAdmin, createProduct)
router.put('/:id', passportCall("jwtStrat"), permissionsIsAdmin, updateProduct)
router.delete('/:id', passportCall("jwtStrat"), permissionsIsAdmin, deleteProduct)

export default router