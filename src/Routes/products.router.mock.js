import { Router } from "express";
import {getProducts, createProducts} from '../controllers/products.controller.mock.js';

const router = Router();

router.get("/", getProducts);
router.post("/", createProducts)

export default router;