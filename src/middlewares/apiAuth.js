const jwt = require("jsonwebtoken");
const config = require("config");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ error: "Access denied. Invalid token format." });
    }

    try {
        const secret = process.env.JWT_SECRET || (config.has("jwtSecret") ? config.get("jwtSecret") : "default_jwt_secret");
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(403).json({ error: "Invalid token." });
    }
};

module.exports = { verifyToken };
