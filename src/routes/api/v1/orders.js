const express = require("express");
const router = express.Router();
const Order = require("../../../models/Order");
const Product = require("../../../models/Product");

// POST /api/v1/orders
// Requires a logged-in user (token)
router.post("/", async (req, res) => {
    try {
        const { products } = req.body;
        // products should be an array of { product: productId, quantity: number }

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Order must contain at least one product" });
        }

        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            if (!item.product || !item.quantity) {
                return res.status(400).json({ error: "Each product item must have 'product' ID and 'quantity'" });
            }

            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ error: `Product with id ${item.product} not found` });
            }

            totalAmount += product.price * item.quantity;
            orderProducts.push({
                product: product._id,
                quantity: item.quantity
            });
        }

        const newOrder = new Order({
            user: req.user.user_id,
            products: orderProducts,
            totalAmount
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error placing order" });
    }
});

module.exports = router;
