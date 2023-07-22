import ProductService from "./services/Dao/db/product.service.js"

export const permissionsIsUser = (req, res, next) => {
    if(req.user.role === "user") return next()
    return res.status(403).send({status:"WRONG", message:"You need to be a user to perform this action."})
}
export const permissionsIsPremiumOrAdmin = async (req, res, next) => {
    const productService = new ProductService();
    if(req.user.role === "premium") {
        const {id} = req.params
        if(id){
            const result = await productService.getProductById(id)
            if(result.owner === req.user.email){
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
export const permissionsIsPremiumOrUser = async (req, res, next) => {
    const productService = new ProductService();
    if(req.user.role === "premium") {
        const {id} = req.params
        const bodyId = req.body.product_id
        if(id){
            const result = await productService.getProductById(id)
            if(result.owner === req.user.email){
                return res.status(403).send({status:"WRONG", message:"You own this product, so you can't buy it"})
            }
            return next()
        }else if(bodyId){
            const result = await productService.getProductById(bodyId)
            if(result.owner === req.user.email){
                return res.status(403).send({status:"WRONG", message:"You own this product, so you can't buy it"})
            }
            return next()
        }
        return next()
    }
    else if(req.user.role === "user"){
        return next()
    }
    return res.status(403).send({status:"WRONG", message:"You need to be a user to perform this action."})
}
