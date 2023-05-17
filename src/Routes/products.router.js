import { Router } from "express";
import passport from 'passport';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";
import permissionsMiddleware from "../middlewares/permissions.midddleware.js";

const router = Router()

router.get('/', getProducts)
router.get('/:pid', getProductById)
router.post('/', /*permissionsMiddleware, passport.authenticate("jwtStrat"),*/ createProduct)
router.put('/:id', passport.authenticate("authStrat"), permissionsMiddleware, updateProduct)
router.delete('/:id', passport.authenticate("jwtStrat"), permissionsMiddleware, deleteProduct)

export default router