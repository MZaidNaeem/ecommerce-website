const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const config = require("config");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const payload = {
            user_id: user._id,
            role: user.role
        };

        const secret = process.env.JWT_SECRET || (config.has("jwtSecret") ? config.get("jwtSecret") : "default_jwt_secret");
        
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });

        res.json({ token, message: "Login successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;
