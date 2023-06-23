import mongoose from "mongoose";
import UserService from "../../src/services/Dao/db/user.service.js";
import config from "../../src/config/config.js";
import { generateUser } from "../../src/util.js";
import chai from "chai";


mongoose.connect(config.mongoUrlTest?config.mongoUrlTest:config.mongoUrl);

const expect = chai.expect;

describe("Testing User service",() => {
    before(async function(){
        if ( mongoose.connection.collections.length > 0) {
            await mongoose.connection.collections.users.drop();
        }
        this.userService = new UserService();
    });
    after(async function() {
        await mongoose.connection.collections.users.drop();
    });
    beforeEach(async function(){
        this.timeout(5000);
        await mongoose.connection.collection("users").deleteMany({});
    })
    it('Devolver los usuarios en formato de arreglo (sin usuarios).', async function(){
        let emptyArray = [];
        const result = await this.userService.getAll();
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
    });

    it("Crear usuario correctamente en la BD", async function(){
        const userMock = generateUser(true)
        const result = await this.userService.saveUser(userMock);
        expect(result._id).to.be.ok;
    })

    it("No puedo crear usuario sin datos clave", async function(){
        const userMock = {};
        const result = await this.userService.saveUser(userMock);
        expect(result).to.haveOwnProperty("error")
    })
    
    it("Borrar usuario OK", async function(){
        const userMock = generateUser(true)
        const resultUser = await this.userService.saveUser(userMock);
        const result = await this.userService.delete(resultUser.username);
        expect(result).to.be.ok
    })
    it("Crear usuario con mail duplicado", async function(){
        const userMock = generateUser(true)
        await this.userService.saveUser(userMock);
        const resultUser = await this.userService.saveUser(userMock);
        expect(resultUser).to.haveOwnProperty("error")
    })
});