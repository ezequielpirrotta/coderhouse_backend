import { Router } from "express";
import {addProductToCart, createCart, deleteCart, deleteProductFromCart, deleteProducts, getCartById, getCarts,
        purchaseCart, replaceCart, updateProductFromCart} 
        from "../controllers/cart.controller.js";
import { permissionsIsPremiumOrUser } from "../middlewares/permissions.middleware.js";
import { passportCall } from "../util.js";

const router = Router()

router.get('/', getCarts)
router.get('/:cid', getCartById)
router.post('/', createCart)
router.put('/:cid', passportCall('jwtStrat'), permissionsIsPremiumOrUser, replaceCart)
router.put('/:cid/product/:pid', passportCall('jwtStrat'), permissionsIsPremiumOrUser, updateProductFromCart)
router.put('/:cid/product', passportCall('jwtStrat'), permissionsIsPremiumOrUser, addProductToCart)
router.post('/:cid/purchase', passportCall('jwtStrat'), permissionsIsPremiumOrUser, purchaseCart)
router.delete('/:cid/products/:pid', deleteProductFromCart)
router.delete('/:cid', deleteProducts)
router.delete('/', deleteCart)

export default router