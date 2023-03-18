import { Router } from "express";
import DBMessageManager from "../Dao/MongoManagers/DBMessageManager.js";
import socketServer from "../app.js";
const dbMsg = new DBMessageManager();
const router = Router()

router.get('/', async (req, res, next) => {
    try {
        let messages = await dbPm.getProducts(); 
        res.status(200).send(messages);
    }
    catch(error) {
        next(error)
    }
})
router.post('/', async (req, res, next) => {
    let {msg} = req.body;
    let {user} = req.body;
    try {
        product = await dbMsg.addMessage(msg,user)
        if(!req.body.front) {
            socketServer.emit("event_product_created", {message: msg, user: user})
        }
        res.status(200).send({
            status: 'OK',
            message: "Mensaje creado correctamente",
            data: product
        });
    }
    catch(error) {
        next(error);
    }
})

export default router;