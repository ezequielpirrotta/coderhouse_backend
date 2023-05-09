import ProductService from "../services/Dao/db/product.service.js";
import TicketService from "../services/Dao/db/ticket.service.js";
import UserService from "../services/Dao/db/user.service.js";
import config from "../config/config.js";

const ticketService = new TicketService();
const userService = new UserService();
const productsService = new ProductService();

export const getTickets = async (req, res, next) => {
    try {
        const tickets = await ticketService.getAll();
        res.send({status: 200, payload: tickets});
    }   
    catch(error) {
        next(error)
    }
}

export const getTicketById = async (req, res, next) => {
    try {
        const {tid} = req.params;
        const ticket = await ticketService.getTicketById(tid);
        res.send({status: 200, payload: ticket});
    }   
    catch(error) {
        next(error)
    }
}
export const createTicket = async (req, res, next) => {
    try {
        const {username,products} = req.body;
        const resultUser = await userService.getUserByUsername(username);
        //const resultProducts = await productsService.getProducts({limit: 999});
        const resultProducts = await fetch(config.endpoint+config.port+'/api/products/?limit=999')
        .then( (response) => response.json());
        //console.log(resultProducts);
        //let actualTickets = resultProducts.filter(product=>products.includes(product._id));
        let actualTickets = resultProducts.payload.filter(product=> {
            let flag = false;
            console.log(product._id)
            products.forEach(element => {
                console.log(element._id)
                if(element._id === product._id){
                    flag = true
                }
            });
            return flag;
            //console.log(products.includes(product._id))
        })
        console.log(actualTickets)

        let sum = actualTickets.reduce((acc,prev)=>{
            acc += prev.product.price * prev.quantity 
            return acc;
        },0)
        let ticketNumber = Date.now() + Math.floor(Math.random()*10000+1)

        let ticket = {
            code: ticketNumber,
            purchaser: username,
            purchase_datetime: new Date(),
            products: actualTickets.map(product=>product.id),
            amount: sum,
        }

        const ticketResult = await ticketService.createTicket(ticket);
        resultUser.orders.push(ticketResult._id)
        await userService.updateUser(user, resultUser)
        res.send({status: 200, payload: result});
    }   
    catch(error) {
        next(error)
    }
}
export const resolveTicket = async (req, res, next) => {
    try {
        const {resolve} = req.query;
        let ticket = await ticketService.getTicketById(req.params.tid);
        ticket.status=resolve;
        await ticketService.resolveTicket(ticket._id, ticket);
        res.send({status: 200, result: "Order solved"});
    }
    catch(error) {
        next(error)
    }
}
