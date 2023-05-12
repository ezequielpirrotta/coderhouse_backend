import productModel from "../models/product.model.js";
import ProductDTO from "../DTOs/product.model.DTO.js";

class ProductService {
    
    getProducts = async (params) => {
        try {
            let limit =  params.limit? parseInt(params.limit) : 10;
            let page = params.page? parseInt(params.page) : 1;
            let category = params.category? params.category : null;
            let available = params.available? params.available : null;
            let sort = params.sort? params.sort==='asc'? 1 : params.sort==='desc'? -1 : null : null;

            let result = null;
            if(category||available||sort||page||limit) {
                result = await productModel.paginate(
                    category||available?
                        category&&!available?{category: category}:
                            !category&&available?{available:available}:
                                {category: category, available: available}
                    :{},
                    sort?{price: sort, limit: limit, page: page}:{limit: limit, page: page}
                );
            }
            if(result.totalDocs > 0 && result.docs.length > 0) {
                let response = {
                    status: "success",
                    payload: result.docs,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: '',
                    nextLink: ''
                }
                return response;
            }
            else {
                throw Error("Products not found.");
            }
        } catch (error) {
            throw {
                code: 404,
                message: 'Error getting products.',
                detail: error.message
            };
        }
    }
    getProductById = async (id) => {
        try {
            let product = await productModel.findById(id)
            if(product) {
                return product;
            }
            else {
                throw Error("Product not found");
            }
        }
        catch (error) {
            throw {
                code: 404,
                message: `Error getting product with ID: ${id}.`,
                detail: error.message
            };
        }
    }
    create = async (product) => {
        let newProduct = new ProductDTO(product);
        try {
            let result = await productModel.create(newProduct);
            if(result) {
                return {_id: result._id, ...newProduct};
            }
            else {
                throw Error("No se encuentra el producto creado.");
            }
        } catch (error) {
            throw {
                message: `Error creando producto nuevo: ${newProduct.title}`,
                detail: `Detalle del error: ${error.message}`,
                data: newProduct
            };
        }
       
    }
    updateProduct = async (pid, data) => {
        try {
            let productUpdated = {}
            if(data.field === "stock") {
                productUpdated[data.field] = data.newValue;
                productUpdated["available"] = data.newValue > 0? true : false;
            }
            else {
                productUpdated[data.field] = data.newValue;
            }
            let result = await productModel.updateOne({_id: pid}, {...productUpdated});
            if(result.modifiedCount > 0){
                let product = await this.getProductById(pid);

                return {fieldUpdated: data.field, newValue: data.newValue, ...product._doc};
            }
            else {
                throw Error("El valor elegido es el mismo al que intenta cambiar, intente con uno diferente.")
            } 
                
        }
        catch (error) {
            throw {
                code: 409,
                message: "Error actualizando producto.",
                detail: error.message,
                data: {id: pid, ...data}
            } 
        }
    }
    deleteProduct = async (id) => {
        try {
            if(id) {
                let result = await productModel.deleteOne({_id: id});
                if(result.deletedCount > 0) {
                    return true;
                }
                else {
                    let product = await this.getProductById(id)
                    if(product) {
                        throw Error("No se pudo borrar el producto.")
                    }
                    else {
                        throw {
                            code: 404,
                            detail: "No se encontró el producto!"
                        } 
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
        catch (error) {
            throw {
                code: error.code,
                message: 'Error eliminando producto',
                detail: error.detail? error.detail : error.message 
            }
        }
    }
}
export default ProductService
