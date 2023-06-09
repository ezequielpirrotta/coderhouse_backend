import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";
import {permissionsIsPremiumOrAdmin} from "../middlewares/permissions.midddleware.js";
import { passportCall } from "../util.js";

const router = Router()

router.get('/', getProducts)
router.get('/:pid', getProductById)
router.post('/', passportCall("jwtStrat"), permissionsIsPremiumOrAdmin, createProduct)
router.put('/:id', passportCall("jwtStrat"), permissionsIsPremiumOrAdmin, updateProduct)
router.delete('/:id', passportCall("jwtStrat"), permissionsIsPremiumOrAdmin, deleteProduct)

export default router