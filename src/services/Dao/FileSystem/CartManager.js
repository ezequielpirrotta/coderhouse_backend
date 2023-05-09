import fs  from 'fs' // tener el campo "type":"module", en el package.json para correcto funcionamiento
import path from 'path';

class CartManager  {
    #dirPath;
    #filePath;
    #fileSystem;
    constructor(filePath){
        try {
            this.#dirPath = path.parse(filePath).dir
            this.#filePath = filePath; 
            this.#fileSystem = fs;
        }
        catch (e) {
            throw Error(e.message)
        }
    }
    #getCarts = async () => {
        try {
            let carts = [];
            await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
            if(this.#fileSystem.existsSync(this.#filePath)) {
                carts = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8")
                if(carts === '') {
                    await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify([]));
                }
            }
            else {
                await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify([]));
            }
            carts = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            carts = JSON.parse(carts)
            return Object.values(carts);
        } catch (error) {
            throw Error(`Error consultando los productos por archivo, valide el archivo: ${this.#dirPath} , detalle del error: ${error}`);
        }
    }
     
    getCartById = async (id) => {
        try {
            let cart = await this.#getCarts()
            cart = cart.find(element => element.id === id)
            if(cart) {
                return cart;
            }
            else {
                throw Error("Cart not found");
            }
        }
        catch (error) {
            throw {
                code: 404,
                message: `Error consiguiendo cart con id: ${id}`,
                detail: `Detalle del error: ${error.message}`
            };
        }
    }
    addCart = async (products) => {
        
        let newCart = { products: products };

        try {
            let carts = await this.#getCarts();
            let id = 0;
            if(carts.length !== 0) {
                if(carts[carts.length - 1]) {
                    id = carts[carts.length - 1].id + 1; 
                }
                else {
                    id = carts[0].id + 1;
                }
            }
            else { 
                id = Math.floor(Math.random() * 1000);
            }
            carts.push({id: id, ...newCart});
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(carts));
            return true;
        } catch (error) {
            throw {
                message: `Error creando carrito nuevo: ${newCart.id}`,
                detail: `Detalle del error: ${error.message}`
            };
        }
       
    }
    addToCart = async (cart_id, product_id) => {
        let cart = await this.getCartById(cart_id);
        let carts = await this.#getCarts();
        try {
            if(cart.length !== 0) {
                let result = cart.products.find(element => element.id === product_id)
                if(result) {
                    let index = cart.products.findIndex(element => element.id === product_id) >= 0? cart.products.findIndex(element => element.id === product_id) : null;
                    index !== -1? cart.products[index].quantity += 1 : null; 
                }
                else {
                    cart.products.push( {
                        id: product_id,
                        quantity: 1 
                    }) 
                }
                carts.push(cart)
                this.#fileSystem.writeFileSync(this.#filePath, JSON.stringify(carts));
                if (!this.#fileSystem.existsSync(this.#filePath)) throw Error("No se pudo escribir el archivo.")
                return cart;
            }
            else {
                throw {
                    code: 404,
                    message: `Error agregando producto: ${product_id}`,
                    detail: 'Cart not found'
                }
            } 
        }
        catch(e) {
            throw {
                code: e.code,
                message: e.message? e.message : `Error agregando producto: ${product_id}`,
                detail: e.detail? e.detail : e.message,
            }
        }
    }
    
    deleteCart = async (id) =>{
        try {
            let carts = await this.#getCarts();
            id = parseInt(id)
            if(id) {
                if(carts.find(element => element.id === id)) {
                    let current_amount = carts.length;
                    carts = carts.filter(element => element.id !== id);
                    let after_amount = carts.length;
                    if(after_amount === current_amount) {
                        throw Error ("No se pudo eliminar el producto");
                    }
                    else {
                        this.#fileSystem.writeFileSync(this.#filePath, JSON.stringify(carts));
                        if (!this.#fileSystem.existsSync(this.#filePath)) throw Error("No se pudo escribir el archivo")
                    }
                }
                else {
                    throw {
                        code: 404,
                        detail: "No se encontró el carrito!"
                    } 
                }
            }
            else {
                throw {
                    code: 400,
                    detail: "Valor id vacío"
                }
            }
        }
        catch (e) {
            throw {
                code: e.code,
                message: e.message? e.message : 'Error eliminando carrito',
                detail: e.detail? e.detail : e.message 
            }
        }
    }
}
export default CartManager