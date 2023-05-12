import { Router } from "express";
import {addProductToCart, createCart, deleteCart, deleteProductFromCart, deleteProducts, getCartById, getCarts,
        purchaseCart, replaceCart, updateProductFromCart} 
        from "../controllers/cart.controller.js";

const router = Router()

router.get('/', getCarts)
router.get('/:cid', getCartById)
router.post('/', createCart)
router.put('/:cid', replaceCart)
router.put('/:cid/product/:pid', updateProductFromCart)
router.put('/:cid/product', addProductToCart)
router.post('/:cid/purchase', purchaseCart)
router.delete('/:cid/products/:pid', deleteProductFromCart)
router.delete('/:cid', deleteProducts)
router.delete('/', deleteCart)

export default router