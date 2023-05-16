import { Router } from "express";
import cookieParser from "cookie-parser";
const router = Router()

router.use(cookieParser())
router.post('/setCookie', (req, res) => {
    const {cookieName,cookieValue,cookieTime} = req.body
    res.cookie(cookieName, cookieValue,{maxAge: cookieTime}).send('Cookie')
})
router.get('/getCookie/:name', (req, res) => {
    const {name} = req.params.name;
    let cookie = req.cookies[name];
    res.send({cookie: cookie})
})
router.post('/updateCookie',(req,res)=>{
    const {cookieName,cookieValue} = req.body
    req.cookies[cookieName] = cookieValue;
})
export default router;