const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isAdmin } = require('../middlewares/auth');

async function getSalesData() {
    // Total Revenue & Total Orders
    const orders = await Order.find({ status: { $ne: 'cancelled' } }).populate('products.product');
    let totalRevenue = 0;
    let totalOrders = orders.length;

    let productSales = {};

    orders.forEach(order => {
        totalRevenue += order.totalAmount;
        order.products.forEach(p => {
            if (p.product) {
                const pid = p.product._id.toString();
                if (!productSales[pid]) {
                    productSales[pid] = { name: p.product.name, quantity: 0 };
                }
                productSales[pid].quantity += p.quantity;
            }
        });
    });

    let topProduct = { name: 'N/A', quantity: 0 };
    for (let key in productSales) {
        if (productSales[key].quantity > topProduct.quantity) {
            topProduct = productSales[key];
        }
    }

    return { 
        totalRevenue, 
        totalOrders, 
        topProduct: topProduct.name,
        topProductQuantity: topProduct.quantity
    };
}

// GET /sales route
router.get('/sales', isAdmin, async (req, res) => {
    try {
        const salesData = await getSalesData();
        res.render('sales', { 
            layout: 'admin-layout',
            title: 'Sales Dashboard',
            ...salesData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET /api/sales-data route
router.get('/api/sales-data', isAdmin, async (req, res) => {
    try {
        const salesData = await getSalesData();
        res.json(salesData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
