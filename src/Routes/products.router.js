import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct,  } from "../controllers/products.controller.js";

const router = Router()

router.get('/', getProducts)
router.get('/:pid', getProductById)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router