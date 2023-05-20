import { Router } from "express";

const router = new Router()

router.get("/",(req,res)=>{
    req.logger.warning("Test de log warning");
    req.logger.fatal("Algo salió terriblemente mal!!")
    req.logger.http("Otro log de HTTP!")|
    res.send({message:"Test logger!!"})
})

export default router