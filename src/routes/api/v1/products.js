const express = require("express");
const router = express.Router();
const Product = require("../../../models/Product");

// GET /api/v1/products
router.get("/", async (req, res) => {
    try {
        const LIMIT = parseInt(req.query.limit) || 8;
        
        // ── Query params ──
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const search = (req.query.search || "").trim();
        const category = (req.query.category || "").trim();
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
        const sortBy = req.query.sortBy || "default"; 

        // ── Build filter ──
        const filter = {};
        if (search) filter.name = { $regex: search, $options: "i" };
        if (category) filter.category = category;
        filter.price = { $gte: minPrice };
        if (isFinite(maxPrice)) filter.price.$lte = maxPrice;

        // ── Sort ──
        const sortMap = {
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            rating: { rating: -1 },
            name: { name: 1 },
            default: { _id: 1 },
        };
        const sort = sortMap[sortBy] || sortMap.default;

        // ── Pagination ──
        const total = await Product.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(total / LIMIT));
        const safePage = Math.min(page, totalPages);
        const skip = (safePage - 1) * LIMIT;

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(LIMIT);

        res.json({
            products,
            pagination: {
                currentPage: safePage,
                totalPages,
                totalItems: total,
                limit: LIMIT
            },
            filters: { search, category, minPrice, maxPrice: isFinite(maxPrice) ? maxPrice : null, sortBy }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error retrieving products" });
    }
});

// GET /api/v1/products/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        if (err.name === 'CastError') {
             return res.status(400).json({ error: "Invalid product ID format" });
        }
        res.status(500).json({ error: "Server error retrieving product" });
    }
});

module.exports = router;
