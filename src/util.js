import {fileURLToPath} from 'url';
import path, { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import passport from 'passport';

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync());

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const PRIVATE_KEY = "MyCommerceSecretKeyJWT";
/**
 * Generate token JWT usando jwt.sign:
 * Primer argumento: objeto a cifrar dentro del JWT
 * Segundo argumento: La llave privada a firmar el token.
 * Tercer argumento: Tiempo de expiración del token.
 */
export const generateJWToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '24h'});
};
/**
 * Metodo que autentica el token JWT para nuestros requests.
 * OJO: Esto actúa como un middleware, observar el next.
 * @param {*} req Objeto de request
 * @param {*} res Objeto de response
 * @param {*} next Pasar al siguiente evento.
 */
export const authToken = (req, res, next) => {
    //El JWT token se guarda en los headers de autorización.
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({error: "User not authenticated or missing token."});
    }
    const token = authHeader.split(' ')[1]; //Se hace el split para retirar la palabra Bearer.
    //Validar token
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: "Token invalid, Unauthorized!"});
        req.user = credentials.user;
        next();
    });
};
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({error: info.messages?info.messages:info.toString()});
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).split(path.sep).join(path.posix.sep);

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, __dirname+'/public/img');
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})
export const uploader = multer({storage})
export default __dirname;