import { Console } from 'console';
import fs  from 'fs' // tener el campo "type":"module", en el package.json para correcto funcionamiento
import path from 'path';
import Product from './Product.js';

class ProductManager {
    #dirPath;
    #filePath;
    #fileSystem;
    constructor(filePath){
        try {
            //let file = path.split('\\').pop().split('/').pop();
            this.#dirPath = path.parse(filePath).dir
            this.#filePath = filePath;
            //console.log(this.#filePath) 
            this.#fileSystem = fs;
        }
        catch (e) {
            console.log(e.code)
        }
    }
    getProducts = async () => {
        try {
            
            await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
            if(!this.#fileSystem.existsSync(this.#filePath)) {
                await this.#fileSystem.promises.writeFile(this.#filePath, JSON.stringify([]));
            }
            let products = await this.#fileSystem.promises.readFile(this.#filePath, "utf-8");
            products = JSON.parse(products)
            return Object.values(products);
        } catch (error) {
            console.error(`Error consultando los productos por archivo, valide el archivo: ${this.#dirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los productos por archivo, valide el archivo: ${this.#dirPath},
             detalle del error: ${error}`);
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
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        let newProduct = new Product(title, description, price, thumbnail, code, stock);

        try {
            let products = await this.getProducts();
            if(products.length !== 0) {
                let result = products.find(element => element.code === code)
                if(result) {
                    return "Error: código repetido";
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
            return true;
        } catch (error) {
            throw Error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
        }
       
    }
    updateProduct = async (data) => {
        try {
            let products = await this.getProducts();
            if(data.id && data.field && data.field !== 'id') {
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
            }
            else {
                return false;
            }
        }
        catch (error) {
            throw Error(`Error actualizando producto, detalle del error: ${error}`);
        }
    }
    deleteProduct = async (id) =>{
        try {
            let products = await this.getProducts();
            if(id) {
                if(products.find(element => element.id === id)) {
                    products = products.filter(element => element.id !== id);
                    if(products.length === 0) {
                        throw Error ("No se pudo eliminar el producto");
                    }
                    else {
                        this.#fileSystem.writeFileSync(this.#filePath, JSON.stringify({"products": products}));
                        if (!this.#fileSystem.existsSync(this.#filePath)) throw Error("No se pudo escribir el archivo")
                    }
                }
                else {
                    throw Error ("No se encontró el producto!")
                }
            }
            else {
                return false;
            }
        }
        catch (e) {
            throw Error(`Error eliminando producto, detalle del error: ${error}`);
        }
    }
}
export default ProductManager
