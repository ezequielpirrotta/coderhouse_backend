import { Router } from 'express';
import passport from 'passport';
import { passportCall } from '../util.js';
import { login, gitHubLogin, register, logout, resetPassword } from '../controllers/sessions.controller.js';
const router = Router();

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});
router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/github/error'}), gitHubLogin); 
router.post("/register", passport.authenticate('register', {failureRedirect: '/api/sessions/fail-register'}), register);
router.post("/login", passport.authenticate('login', {failureRedirect: '/api/sessions/fail-login'}), login);
router.get("/logout", logout);
router.post("/resetPassword", resetPassword);
router.get('/current', passportCall('current'), (req,res) =>{
    res.status(200).send(req.user);
})
 
router.get('/fail-register', (req, res)=>{
    res.status(401).send({error: res.message});
});
router.get("/fail-login", (req, res) => {
    res.status(401).send({error: res.message});
});

export default router;