import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy, { ExtractJwt } from "passport-jwt";
import UserService from "../services/Dao/db/user.service.js";
import GitHubStrategy from 'passport-github2';
import { PRIVATE_KEY, createHash, isValidPassword } from "../util.js";
import config from "./config.js";
import CartService from "../services/Dao/db/cart.service.js";

//Declaración de estrategias
const localStrategy = passportLocal.Strategy;
const JwtStrat = jwtStrategy.Strategy;
const userService = new UserService();
const cartService = new CartService()
const initializePassport = () => {
    /**
     *  Inicializando la estrategia local, username sera para nosotros email.
     *  Done será nuestro callback
    */ 
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.99823703b009d6be',
            clientSecret: 'f3de92ddfa3acab775d66c1bed5f0709dcf883a6',
            callbackUrl: 'http://localhost:8080/api/sessions/githubcallback'
        },
        async(accessToken,refreshToken,profile,done)=>{
            try {
                if(!profile._json.email) {
                    throw {
                        message: "Mail private, make your mail public to login"
                    }
                }
                const user = await userService.getUserByUsername(profile._json.email);
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name? profile._json.name : profile._json.login,
                        last_name: '',
                        age: null,
                        username: profile._json.email? profile._json.email:'',
                        password: '',
                        loggedBy: "GitHub"
                    };
                    const result = await userService.saveUser(newUser);
                    return done(null, result);
                } else {
                    return done(null, user);
                }
            } catch (error) {
                return done(error.message); 
            }
        })
    );
    passport.use('register',new localStrategy(
        {passReqToCallback: true}, async (req, username, password, done) => {
            try {
                const { first_name, last_name, username, age, password} = req.body;
                if(!username) {
                    return res.status(400).send({status: "error", message: "Empty email"});
                }
                const exists = await userService.getUserByUsername(username);
                if (exists){
                    return done(null, false, {status: "error", message: "User already exists."})
                }
                
                let cart = await cartService.addCart();

                const user = {
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    age: age,
                    password: createHash(password),
                    cart: cart._id
                };
                const result = await userService.saveUser(user);
                return done(null,result)
            }
            catch(error) {
                return done("Error loging up user: "+error)
            }

        }
    ));
    passport.use('login', new localStrategy(
        {passReqToCallback: true}, async (req, username, password, done) => {
            
            try{
                const user = await userService.getUserByUsername(username);
                if(!user){
                    return done(null,false,{status:"error",message:"User not found"});
                } 
                if(!isValidPassword(user,password)) {
                    return done(null,false,{status: "error", message:"Incorrect password"}); 
                }
                const cart = await cartService.getCartById(user.cart)
                return done(null, {user:user,cart:cart})
            }
            catch(error) {
                return done(error)
            }
        }
    ));
    passport.use('jwtStrat', new JwtStrat(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },async(jwt_payload, next) => {
            try {
                return next(null, jwt_payload.user);
            } 
            catch (error) {
                console.error(error);
                return next(error);
            }
        }
    ));
    passport.use('current', new JwtStrat(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },async(jwt_payload, next) => {
            try {
                let user = await userService.getUserByUsername(jwt_payload.user.email)
                return next(null, user);
            } 
            catch (error) {
                console.error(error);
                return next(error);
            }
        }
    ));
    passport.use('permission', new JwtStrat(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        },async(jwt_payload, next) => {

        }
    ))
}
const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) { //Validamos que exista el request y las cookies.
        token = req.cookies['commerceCookieToken'];
    }
    return token;
};    
export default initializePassport