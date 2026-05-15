const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const config = require("config");
const mongoose = require("mongoose");

const app = express();

// ── View engine & static files ──────────────────────────────────────────────
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(express.static("public"));

// ── MongoDB connection ───────────────────────────────────────────────────────
const MONGO_URI = config.has("mongoURI") ? config.get("mongoURI") : process.env.MONGO_URI || "mongodb://localhost:27017/lamaretail";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => console.error("❌  MongoDB connection error:", err));

// ── Mongoose Schema & Model ──────────────────────────────────────────────────
const Product = require("./models/Product");

// ── Routes ───────────────────────────────────────────────────────────────────

// Home page
app.get("/", (req, res) => res.render("index"));

// Products catalog
app.get("/products", async (req, res) => {
  try {
    const LIMIT = 8;

    // ── Query params ──
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const sortBy = req.query.sortBy || "default"; // default | price_asc | price_desc | rating | name

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

    // ── Category list for the filter dropdown ──
    const categories = await Product.distinct("category");

    res.render("products", {
      products,
      categories,
      // pagination
      currentPage: safePage,
      totalPages,
      total,
      // active filters (so the template can repopulate form fields)
      filters: { search, category, minPrice, maxPrice: isFinite(maxPrice) ? maxPrice : "", sortBy },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error – check MongoDB connection.");
  }
});

const PORT = config.has("port") ? config.get("port") : process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  Server running at http://localhost:${PORT}`));;