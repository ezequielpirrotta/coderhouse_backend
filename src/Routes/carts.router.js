import { Router } from "express";
import {addProductToCart, createCart, deleteCart, deleteProductFromCart, deleteProducts, getCartById, getCarts,
        purchaseCart, replaceCart, updateProductFromCart} 
        from "../controllers/cart.controller.js";
import { permissionsIsUser } from "../middlewares/permissions.midddleware.js";
import { passportCall } from "../util.js";

const router = Router()

router.get('/', getCarts)
router.get('/:cid', getCartById)
router.post('/', createCart)
router.put('/:cid', passportCall('jwtStrat'), permissionsIsUser, replaceCart)
router.put('/:cid/product/:pid', passportCall('jwtStrat'), permissionsIsUser, updateProductFromCart)
router.put('/:cid/product', passportCall('jwtStrat'), permissionsIsUser, addProductToCart)
router.post('/:cid/purchase', passportCall('jwtStrat'), permissionsIsUser, purchaseCart)
router.delete('/:cid/products/:pid', deleteProductFromCart)
router.delete('/:cid', deleteProducts)
router.delete('/', deleteCart)

export default router