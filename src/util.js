import {fileURLToPath} from 'url';
import path, { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import passport from 'passport';
import {faker} from '@faker-js/faker';
import fs, { mkdir } from 'fs';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync());

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const PRIVATE_KEY = "MyCommerceSecretKeyJWT";
/**
 * Generate token JWT usando jwt.sign:
 * Primer argumento: objeto a cifrar dentro del JWT
 * Segundo argumento: La llave privada a firmar el token.
 * Tercer argumento: Tiempo de expiración del token.
 */
export const generateJWToken = (user,time) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: time});
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) { return next(err);}
            if (!user) {
                console.log("estoy acá en la call")
                return res.status(401).send({error: info.messages?info.messages:typeof info === 'object'?info:info.toString()});
            }
            req.user = user;
            next();
        })(req, res, next);
    }
    
};
export const authorization = (role) => {
    return async (req,res,next) => {
        if(!req.user) return res.status(401).send("Unauthorized: JWT not found");
        if(req.user.role != role) {
            return res.status(403).send("Forbidden: The user does not have the permissions for this role");
        }
        next()
    }
}
faker.locale = 'es'; //Idioma de los datos

export const generateUser = (hasCart = false) => {
    let user = {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        age: parseInt(faker.random.numeric(2)),
        username: faker.internet.email(),
        password: createHash(faker.random.alphaNumeric(6)),
        
        //sex: faker.name.sex(),
        //birthDate: faker.date.birthdate(),
        //products,
        //pfp: faker.internet.avatar(),
        //id: faker.database.mongodbObjectId(),
    };
    hasCart? user.cartId = faker.database.mongodbObjectId() : null
    return user;
};

export const generateProduct = () => {
    const categories = ["comida","ropa","otros"]
    const fakerCategories = ["food","fashion"]
    let product = {
        _id: faker.database.mongodbObjectId(),
        code: faker.random.alphaNumeric(7),
        title: faker.commerce.productName(),
        description: faker.lorem.text(),
        price: parseInt(faker.random.numeric(3)),
        stock: parseInt(faker.random.numeric(2)),
        category: categories[faker.mersenne.rand(3, 1)-1],
        thumbnail: faker.image.imageUrl(640,480,fakerCategories[faker.mersenne.rand(2, 1)-1],true)
    }
    product.is_available = product.stock > 0 ? true : false;
    return product;
};

export const generarCadenaAlfanumerica = (longitud) => {
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var cadena = '';
    if(longitud === 0) {
        cadena = null
    }
    else {
        for (var i = 0; i < longitud; i++) {
            var indice = Math.floor(Math.random() * caracteres.length);
            cadena += caracteres.charAt(indice);
        }
    }
    return cadena;
}
  
export const generarCadenasAlfanumericasUnicas = (longitud, cantidad) => {
    var cadenasUnicas = [];
    if(cantidad === 0) {
        cadenasUnicas = null
    }else if(cantidad > 0){
        while (cadenasUnicas.size < cantidad) {
            var cadena = generarCadenaAlfanumerica(longitud);
            cadenasUnicas.push(cadena);
        }
    }
    return cadenasUnicas;
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).split(path.sep).join(path.posix.sep);

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        let subDir = ""
        switch(file.fieldname) {
            case "avatar":
                subDir = "/profiles";
                break;
            case "docs":
                subDir = "/documents";
                break;
            case "product":
                subDir = "/products";
                break;
        }
        const dir = __dirname+'/public'+subDir;
        
        fs.mkdir(dir, (err) => {
            if (err) console.log(err);
        }); 
        cb(null, dir);
    },
    filename: (req,file,cb) => {
        cb(null, req.user._id.toString()+'_'+file.originalname)
    }
})
export const uploader = multer({storage});

export default __dirname;