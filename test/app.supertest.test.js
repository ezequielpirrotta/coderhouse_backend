import mongoose from "mongoose";
import ProductService from "../src/services/Dao/db/product.service.js";
import config from "../src/config/config.js";
import { generateProduct } from "../src/util.js";
import chai from "chai";
import supertest from "supertest";



const expect = chai.expect;
const requester = supertest(config.serverUrl)

describe("Testing E-commerce App",() => {
    describe("Testing Sessions Api",()=>{
        before(async function(){
            this.timeout(5000);
            this.cookie;
            this.mockUser = {
                username: "alguien@gmail.com", 
                password: "algo", 
                name:"alguien", 
                lastName:"alguien", 
                age:20, 
                adminRole:true,
                premiumRole:false
            }
        })
        beforeEach(function(){
            this.timeout(5000);
        })
        it("Resgister user", async function(){
            const {statusCode, _body, ok} = await requester.post("/api/sessions/register").send(this.mockUser);
            expect(ok).to.be.ok
            expect(statusCode).to.be.ok.and.to.be.eql(201)
            expect(_body.status).to.be.deep.equal('success')
        })
        it("Login user", async function(){
            const {statusCode, _body, ok} = await requester.post("/api/sessions/login").send({ username: this.mockUser.username, password: this.mockUser.password});
            expect(ok).to.be.ok
            expect(_body).to.have.property("payload").and.to.have.property("email").and.to.be.eql(this.mockUser.username)
            //expect(_body.payload).to
        })
    })
    describe("Testing Product Api",()=>{
        describe("User is logged in cases", ()=> {
            before(async function(){
                this.timeout(5000);
                this.cookie;
                this.mockUser = {
                    username: "alguien@gmail.com", 
                    password: "algo", 
                    name:"alguien", 
                    lastName:"alguien", 
                    age:20, 
                    adminRole:true,
                    premiumRole:false
                }
                await requester.post("/api/sessions/register").send(this.mockUser);
                const result = await requester.post("/api/sessions/login").send({ username: this.mockUser.username, password: this.mockUser.password});
                let not_founded = true;
                let cookieResult = ''
                let i = 0;
                while(not_founded){
                    let cookie = result.headers["set-cookie"][i]
                    if(cookie.split('=')[0] === 'commerceCookieToken'){
                        not_founded = false;
                        cookieResult = cookie;
                    }
                    i++
                }
                expect(cookieResult).to.be.ok;
                this.cookie = {
                    name: cookieResult.split('=')[0],
                    value: cookieResult.split('=')[1]
                }
            })
            beforeEach(function(){
                this.timeout(10000);
            })
            it("Crear producto luego de iniciar sesion como admin: El API POST /apis/products debe dejar crear un producto", async function(){
                const productMock = generateProduct(true)
                expect(this.cookie.name).to.be.ok.and.eql('commerceCookieToken');
                const {statusCode, ok} = await requester.post("/api/products").set('Cookie',[`${this.cookie.name}=${this.cookie.value}`]).send(productMock);
                expect(ok).to.be.ok;
                expect(statusCode).to.be.equal(201)
            })
        })
        describe("User is not logged in cases",()=>{
            beforeEach(function(){
                this.timeout(10000);
            })
            it("Crear producto sin autenticar: El API POST /apis/products no debe dejar crear un producto", async function(){
                const productMock = generateProduct(true)
    
                const {statusCode, ok} = await requester.post("/api/products").send(productMock);
                expect(ok).to.be.not.ok;
                expect(statusCode).to.be.equal(401)
            })
        })  
    })
    /*
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
    })*/
});