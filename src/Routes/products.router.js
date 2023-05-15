import { Router } from "express";
import passport from 'passport';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controller.js";
//import { passportCall } from "../util.js";
import UserService from "../services/Dao/db/user.service.js";
import permissionsMiddleware from "../middlewares/permissions.midddleware.js";

const userService = new UserService()
const router = Router()

router.get('/', getProducts)
router.get('/:pid', getProductById)
router.post('/', passport.authenticate("jwtStrat"), permissionsMiddleware, createProduct)
router.put('/:id', passport.authenticate("jwtStrat"), permissionsMiddleware, updateProduct)
router.delete('/:id', passport.authenticate("jwtStrat"), permissionsMiddleware, deleteProduct)

passport.serializeUser((data, done) => {
    console.log(data)
    done(null, data.user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userService.getUserById(id);
        done(null, user);
    } catch (error) {
        console.error("Error deserializando el usuario: " + error);
    }
});
export default router