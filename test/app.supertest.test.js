import config from "../src/config/config.js";
import { generateProduct } from "../src/util.js";
import chai from "chai";
import supertest from "supertest";
import jwt from 'jsonwebtoken'


const expect = chai.expect;
const requester = supertest(config.serverUrl)

describe("Testing E-commerce App",() => {
    describe("Testing Sessions Api",()=>{
        before(async function(){
            this.timeout(10000);
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
            this.timeout(1000);
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
            expect(_body).to.have.property("payload").and.to.have.property("user").and.to.have.property("username").and.to.be.eql(this.mockUser.username)
        })
        it("Login with an unexisting user", async function(){
            const {statusCode, _body, ok} = await requester.post("/api/sessions/login").send({ username: "alguien2@gmail.com", password: "algo2"});
            expect(ok).to.be.not.ok
            expect(statusCode).to.be.eql(401)
            expect(_body).to.have.property("error").to.have.property("message").and.to.be.eql("User not found")
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
            it("Obtener productos creados en tests anteriores: El API GET /apis/products debe devolver un array con productos",async function(){
                const {statusCode, _body, ok} = await requester.get("/api/products").send();
                expect(ok).to.be.ok;
                expect(statusCode).to.be.equal(200)
                expect(_body).to.have.property("payload").and.to.be.a("array")
            })
        })  
    })
    describe("Testing Carts Api",()=>{
        describe("Normal user is logged in cases", ()=> {
            before(async function(){
                this.timeout(5000);
                this.cookieCart;
                this.cookieToken;
                const {_body} = await requester.get("/api/products").send()
                this.product = _body.payload[0]
                this.mockUser = {
                    username: "alguien_user@gmail.com", 
                    password: "algo", 
                    name:"alguien", 
                    lastName:"alguien", 
                    age:20, 
                    adminRole:false,
                    premiumRole:false
                }
                await requester.post("/api/sessions/register").send(this.mockUser);
                const result = await requester.post("/api/sessions/login").send({ username: this.mockUser.username, password: this.mockUser.password});
                let not_founded = true;
                let cookieTokenResult = ''
                let i = 0;
                while(not_founded){
                    let cookie = result.headers["set-cookie"][i]
                    if(cookie.split('=')[0] === 'commerceCookieToken'){
                        not_founded = false;
                        cookieTokenResult = cookie;
                    }
                    i++
                }
                not_founded = true;
                i = 0;
                let cookieCartResult
                while(not_founded){
                    let cookie = result.headers["set-cookie"][i]
                    if(cookie.split('=')[0] === 'cartCookie'){
                        not_founded = false;
                        cookieCartResult = cookie;
                    }
                    i++
                }
                expect(cookieTokenResult).to.be.ok;
                expect(cookieCartResult).to.be.ok;
                this.cookieCart = {
                    name: cookieCartResult.split('=')[0],
                    value: cookieCartResult.split('=')[1]
                }
                if(cookieTokenResult){
                    const {_body} = await requester.get("/api/sessions/current").set('Cookie', [`${cookieTokenResult.split('=')[0]}=${cookieTokenResult.split('=')[1]}`]);
                    this.cookieToken = {
                        name: cookieTokenResult.split('=')[0],
                        value: _body,
                        jwt: cookieTokenResult.split('=')[1] 
                    }
                }
            })
            it("Añadir producto a carrito: El API PUT /apis/carts/:cid/product debe dejar añadir un producto", async function(){
                const productMock = {product_id: this.product._id, quantity: 2}
                expect(this.cookieToken.name).to.be.ok.and.eql('commerceCookieToken');
                const {statusCode, _body, ok} = await requester.put("/api/carts/"+this.cookieToken.value.cart+"/product")
                    .set('Cookie',[`${this.cookieCart.name}=${this.cookieCart.value}`,`${this.cookieToken.name}=${this.cookieToken.jwt}`])
                    .send(productMock);
                expect(ok).to.be.ok;
                expect(statusCode).to.be.equal(200)
                expect(_body).to.have.property("products")
            })
            it("Aumentar cantidad de producto en carrito: El API PUT /apis/carts/:cid/product/:pid debe modificar la cantidad del producto", async function(){
                expect(this.cookieToken.name).to.be.ok.and.eql('commerceCookieToken');
                const {statusCode, _body, ok} = await requester.put("/api/carts/"+this.cookieToken.value.cart+"/product/"+this.product._id)
                    .set('Cookie',[`${this.cookieCart.name}=${this.cookieCart.value}`,`${this.cookieToken.name}=${this.cookieToken.jwt}`])
                    .send({quantity: 5});
                expect(statusCode).to.be.equal(200)
                expect(_body).to.have.property("products")
                expect(_body.products[0].quantity).to.be.deep.equal(5)
            })
            it("Eliminar productos de carrito: El API DELETE /apis/carts/:cid debe dejar eliminar todos los productos del carrito", async function(){
                expect(this.cookieToken.name).to.be.ok.and.eql('commerceCookieToken');
                const {statusCode, _body, ok} = await requester.delete("/api/carts/"+this.cookieToken.value.cart)
                    .set('Cookie',[`${this.cookieCart.name}=${this.cookieCart.value}`,`${this.cookieToken.name}=${this.cookieToken.jwt}`])
                    .send();
                expect(statusCode).to.be.equal(200)
                expect(_body).to.have.property("data").and.to.have.property("cid").and.to.be.deep.equal(this.cookieToken.value.cart)
                //expect(_body.products[0].quantity).to.be.deep.equal(5)
            })
        })
    })
});