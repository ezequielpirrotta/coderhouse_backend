import fs  from 'fs' // tener el campo "type":"module", en el package.json para correcto funcionamiento
import path from 'path';
import Product from '../models/product.js';

class ProductManager {
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
    getProducts = async () => {
        try {
            let products = [];
            await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
            if(this.#fileSystem.existsSync(this.#filePath)) {
                products = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8")
                if(products === '') {
                    await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify([]));
                }
            }
            else {
                await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify([]));
            }
            products = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            products = JSON.parse(products)
            return Object.values(products);
        } catch (error) {
            throw Error(`Error consultando los productos por archivo, valide el archivo: ${this.#dirPath} , detalle del error: ${error}`);
        }
    }
     
    getProductById = async (id) => {
        try {
            let product = await this.getProducts()
            product = product.find(element => element.id === id)
            if(product) {
                return product;
            }
            else {
                throw Error("Product not found");
            }
        }
        catch (error) {
            throw Error(`Error consiguiendo producto con id: ${id}, detalle del error: ${error}`);
        }
    }
    addProduct = async (title, description, price, code, stock, category, thumbnail) => {
        let status = true;
        let newProduct = new Product(title, description, price, code, status, stock, category, thumbnail);

        try {
            let products = await this.getProducts();
            if(products.length !== 0) {
                let result = products.find(element => element.code === code)
                if(result) {
                    throw Error("Código repetido"); 
                }
            } 
            let id = 0;
            if(products.length !== 0) {
                if(products[products.length - 1]) {
                    id = products[products.length - 1].id + 1; 
                }
                else {
                    id = products[0].id + 1;
                }
            }
            else { 
                id = Math.floor(Math.random() * 1000);
            }
            products.push({id: id, ...newProduct});
            await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify(products));
            return {id: id, ...newProduct};
        } catch (error) {
            throw {
                message: `Error creando producto nuevo: ${newProduct.title}`,
                detail: `Detalle del error: ${error.message}`
            };
        }
       
    }
    updateProduct = async (data) => {
        try {
            let products = await this.getProducts();
            if(data.id && data.field && data.field !== 'id') {
                data.id = parseInt(data.id)
                if(products.find(element => element.id === data.id)) {
                    
                    let index = products.findIndex(element => element.id === data.id) >= 0? products.findIndex(element => element.id === data.id) : null;
                    let result = index !== -1? products[index][data.field] = data.newValue : null;
                    if(result){
    
                        this.#fileSystem.writeFileSync(this.#filePath, JSON.stringify(products));
                        if (!this.#fileSystem.existsSync(this.#filePath)) throw Error("No se pudo escribir el archivo.")
                        return products[index];
                    }
                    else {
                        throw Error("No se pudo cambiar el valor.")
                    } 
                }
                else {
                    throw Error("No se encontró el producto.")
                }
            }
            else {
                throw Error("Error en datos enviados.")
            }
        }
        catch (error) {
            throw {
                code: 404,
                message: "Error actualizando producto.",
                detail: `${error.message}`
            } 
        }
    }
    deleteProduct = async (id) =>{
        try {
            let products = await this.getProducts();
            id = parseInt(id)
            if(id) {
                if(products.find(element => element.id === id)) {
                    let current_amount = products.length;
                    products = products.filter(element => element.id !== id);
                    let after_amount = products.length;
                    if(after_amount === current_amount) {
                        throw Error ("No se pudo eliminar el producto");
                    }
                    else {
                        this.#fileSystem.writeFileSync(this.#filePath, JSON.stringify(products));
                        if (!this.#fileSystem.existsSync(this.#filePath)) throw Error("No se pudo escribir el archivo")
                        return {id}
                    }
                }
                else {
                    throw {
                        code: 404,
                        detail: "No se encontró el producto!"
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
                message: e.message? e.message : 'Error eliminando producto',
                detail: e.detail? e.detail : e.message 
            }
        }
    }
}
export default ProductManager