import { Router } from "express";
import { authorization, passportCall } from "../util.js";

const router = Router();

router.get("/login", (req, res) => {
    res.render("login", {token: req.cookies.token});
});

router.get("/register", (req, res) => {
    res.render("register"); 
});
router.get('/reset-password',(req,res) => {
    res.render("resetPassword");
})
router.get("/", 
    passportCall('jwtStrat'),
    authorization('admin'),
    async function(req, res) {
    res.render("profile", {
        user: req.user
    });
});

export default router;