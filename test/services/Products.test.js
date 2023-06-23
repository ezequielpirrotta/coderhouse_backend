import mongoose from "mongoose";
import ProductService from "../../src/services/Dao/db/product.service.js";
import config from "../../src/config/config.js";
import { generateProduct } from "../../src/util.js";
import chai from "chai";


mongoose.connect(config.mongoUrlTest?config.mongoUrlTest:config.mongoUrl);

const expect = chai.expect;

describe("Testing Product service",() => {
    before(async function(){
        if ( mongoose.connection.collections.length > 0) {
            await mongoose.connection.collections.products.drop();
        }
        this.productService = new ProductService();
    });
    after(async function() {
        await mongoose.connection.collections.products.drop();
    });
    beforeEach(async function(){
        this.timeout(5000);
        await mongoose.connection.collection("products").deleteMany({});
    })
    it('Devolver error cuando consulta sin productos creados.', async function(){
        const result = await this.productService.getProducts({});
        expect(result).to.have.property("detail");
    });

    it("Crear product correctamente en la BD", async function(){
        const productMock = generateProduct(true)
        const result = await this.productService.create(productMock);
        expect(result._id).to.be.ok;
    })

    it("No puedo crear producto sin datos clave", async function(){
        const productMock = {};
        const result = await this.productService.create(productMock);
        expect(result).to.have.property("detail")
    })
    
    it("Borrar producto OK", async function(){
        const productMock = generateProduct(true)
        const resultProduct = await this.productService.create(productMock);
        const result = await this.productService.deleteProduct(resultProduct._id);
        expect(result).to.be.ok
    })
    it("Crear producto con código duplicado", async function(){
        const productMock = generateProduct(true)
        await this.productService.create(productMock);
        const resultProduct = await this.productService.create(productMock);
        expect(resultProduct).to.have.property("detail")
    })
    it("Actualizar un producto OK",async function(){
        const productMock = generateProduct(true)
        const resultProduct = await this.productService.create(productMock);
        const data = {field: "title", newValue: "cambie de titulo"}
        const updateResult= await this.productService.updateProduct(resultProduct._id, data);
        expect(updateResult).to.have.property("newValue");
        expect(updateResult.newValue).to.be.deep.equal(data.newValue)
    })
});