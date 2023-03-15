const error_middleware = (error, req, res, next) => {
    let code = error.code? error.code : 400;
    res.status(code).send({
        status: 'WRONG',
        message: error.message,
        detail: error.detail? error.detail : "No detail.",
        data: error.data? error.data : "No data."
    })
    next()
}
export default error_middleware;