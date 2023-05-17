import { Router } from "express";
import {getProducts} from '../controllers/products.controller.mock.js';

const router = Router();

router.get("/", getProducts);

export default router;