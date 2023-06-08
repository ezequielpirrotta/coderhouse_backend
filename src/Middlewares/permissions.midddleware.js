import ProductService from "../services/Dao/db/product.service.js"

export const permissionsIsUser = (req, res, next) => {
    if(req.user.role === "user") return next()
    return res.status(403).send({status:"WRONG", message:"You need to be a user to perform this action."})
}
export const permissionsIsPremiumOrAdmin = (req, res, next) => {
    const productService = new ProductService();
    if(req.user.role === "premium") {
        const {id} = req.params
        if(id){
            const result = productService.getProductById(id)
            if(result.owner === req.user.username){
                return next()
            }
            return res.status(403).send({status:"WRONG", message:"You dont't own this product, so you can't modify it"})
        }
        return next()
    }
    else if(req.user.role === "admin"){
        return next()
    } 
    return res.status(403).send({status:"WRONG", message:"You need to be a premium user or an admin to perform this action."})
}
export const permissionsIsPremiumOrUser = (req, res, next) => {
    const productService = new ProductService();
    if(req.user.role === "premium") {
        const {id} = req.params
        if(id){
            const result = productService.getProductById(id)
            if(result.owner === req.user.username){
                return next()
            }
            return res.status(403).send({status:"WRONG", message:"You dont't own this product, so you can't use it"})
        }
        return next()
    }
    else if(req.user.role === "user"){
        return next()
    }
    return res.status(403).send({status:"WRONG", message:"You need to be a user to perform this action."})
}
