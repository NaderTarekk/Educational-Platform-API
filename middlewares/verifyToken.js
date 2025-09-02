const jwt = require("jsonwebtoken");

// verify token
function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // return the paylod data from token 
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "invalid token" })
        }
    } else {
        res.status(401).json("no token provided");
    }
}

// verify token and authorize the user
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed" })
        }
    })
}

// verify token and admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "You are not allowed, Only admin allowed" })
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };