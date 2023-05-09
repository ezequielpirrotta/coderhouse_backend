import { Router } from 'express';

const router = Router();

router.post('/',function(req, res){
    
    const {cart, name} = req.body 
    console.log(String(name)+" "+JSON.stringify(cart))
    res.cookie("cartCookie", cart,{maxAge: 60*60*1000}).send({status: "todo OK"});  
}); 
router.get('/:name',function(req, res){  
    const {name} = req.params
    
    console.log(typeof name)
    let cookie = req.cookies
    console.log(cookie)
    res.send(cookie);  
});   

export default router;