export default class ProductDTO {
    constructor(product) {
        this.title = product.title, 
        this.description = product.description, 
        this.price = product.price, 
        this.code = product.code, 
        this.available = product.is_available?product.is_available:false, 
        this.stock = product.stock, 
        this.category = product.category, 
        this.thumbnail = product.thumbnail
        if(product.owner){
            this.owner = product.owner
        }
    }
}