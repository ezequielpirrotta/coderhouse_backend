export default class CustomError {
    static createErrorToThrow({name="Error", cause, message, code=1, status_code}) {
        const error = new Error(message, {cause: new Error(cause)});
        error.name = name;
        error.code = code;
        error.status_code = status_code;
        return error;
    };
    static createError({name="Error", cause, message, code=1, status_code=500}) {
        const error = {
            message: message, 
            cause: cause,
            name: name,
            code: code,
            status_code: status_code
        };
        return error;
    };
}