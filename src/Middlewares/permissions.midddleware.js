export const permissionsIsAdmin = (req, res, next) => {
    if(req.user.role === "admin") return next()
    return res.status(403).json({status:"error", message:"You need to be an admin to perfrom this action."})
}
export const permissionsIsUser = (req, res, next) => {
    if(req.user.role === "user") return next()
    return res.status(403).json({status:"error", message:"You need to be a user to perfrom this action."})
}