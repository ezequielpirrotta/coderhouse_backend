import { Router } from "express";
import cookieParser from "cookie-parser";
const router = Router()

router.use(cookieParser())
router.post('/setCookie', (req, res) => {
    const {cookieName,cookieValue,cookieTime} = req.body
    res.cookie(cookieName, cookieValue,{maxAge: cookieTime}).send('Cookie')
})
router.get('/getCookie', (req, res) => {
    
    res.send()
})