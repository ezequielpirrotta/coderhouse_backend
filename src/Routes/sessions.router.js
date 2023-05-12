import { Router } from 'express';
import passport from 'passport';
import UserService from '../services/Dao/db/user.service.js';
import { passportCall } from '../util.js';
import { login, gitHubLogin, register, logout, resetPassword } from '../controllers/sessions.controller.js';
const router = Router();
const userService = new UserService()

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});
router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/github/error'}), gitHubLogin); 
router.post("/register", passport.authenticate('register', {failureRedirect: '/api/sessions/fail-register'}), register);
router.post("/login", passport.authenticate('login', {failureRedirect: '/api/sessions/fail-login'}), login);
router.get("/logout", logout);
router.post("/resetPassword", resetPassword);
router.get('/current', passportCall('current'), (req,res) =>{
    res.status(401).send(req.user);
})
router.get('/fail-register', (req, res)=>{
    res.status(401).send({error: res.message});
});
router.get("/fail-login", (req, res) => {
    res.status(401).send({error: res.message});
});

passport.serializeUser((data, done) => {
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
export default router;