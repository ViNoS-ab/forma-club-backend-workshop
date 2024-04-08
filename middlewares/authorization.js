const jwt = require("jsonwebtoken")

const isAtuhenticated = (req, res, next) => {
    const token = req.cookies.token; 
    try { 
        const {id, username} = jwt.verify(token, "SEEECREEET KEEEEEY")
        req.user = { id, username }
        next()
    }
    catch (error) {
        res.status(401).json({success: false, message: "not authenticated"})
    }

}

module.exports = { isAtuhenticated }
