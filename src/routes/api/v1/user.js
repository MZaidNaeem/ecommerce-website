const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
// GET /api/v1/user/profile
// Requires a logged-in user (token)
router.get("/profile", async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error retrieving user profile" });
    }
});

module.exports = router;
