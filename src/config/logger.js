import winston, { transports } from "winston";
import config from "./config.js";

//Custom logger options:
const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'brightRed',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white'
    }
};

//Custom Logger:
const devLogger = winston.createLogger({
    //Levels:
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        )
    ]
});

//Creating our logger:
const prodLogger = winston.createLogger({
    //Declare transports:
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File(
            {
                filename: './errors.log', 
                level: 'info', //Cambiamos el logger level name.
                format: winston.format.simple()
            }
        )
    ]
});
export const log = (message, req) => {
    return `${message}, ${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
}
//Declare a middleware:
export const addLogger = (req, res, next) => {
    if (config.environment === 'PROD'){
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }
    next();
};