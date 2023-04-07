import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../Dao/models/user.model.js";
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from "../util.js";

//Declaración de estrategias
const localStrategy = passportLocal.Strategy;

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
                const user = await userModel.findOne({username: profile._json.email});
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
                    const result = await userModel.create(newUser);
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
                const exists = await userModel.findOne({username});
                if (exists){
                    return done(null, false, {status: "error", message: "User already exists."})
                }
                const user = {
                    first_name: first_name,
                    last_name: last_name,
                    username: username,
                    age: age,
                    password: createHash(password) 
                };
                const result = await userModel.create(user);
                return done(null,result)
            }
            catch(error) {
                return done("Error loging up user: "+error)
            }

        }
    ))
    passport.use('login', new localStrategy(
        {passReqToCallback: true}, async (req, username, password, done) => {
            try{
                const user = await userModel.findOne({username: username});
                if(!user){
                    return done(null,false,{status:"error",message:"User not found"});
                } 
                if(!isValidPassword(user,password)) {
                    return done(null,false,{status: "error", error:"Incorrect password"}); 
                }
                return done(null, user)
            }
            catch(error) {
                return done(error.message)
            }
        }
    ))
}
export default initializePassport