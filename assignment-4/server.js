const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const config = require("config");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const authMiddleware = require("./middlewares/auth");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/product");

const app = express();

// ── View engine & static files ──────────────────────────────────────────────
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ── MongoDB connection ───────────────────────────────────────────────────────
const MONGO_URI = config.has("mongoURI") ? config.get("mongoURI") : process.env.MONGO_URI || "mongodb://localhost:27017/lamaretail";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => console.error("❌  MongoDB connection error:", err));

// ── Mongoose Schema & Model ──────────────────────────────────────────────────
const Product = require("./models/Product");

// ── Routes ───────────────────────────────────────────────────────────────────

// Admin Panel (Protected by basic auth)
app.use("/admin", authMiddleware, adminRoutes);

// Home page
app.get("/", (req, res) => res.render("index"));

// Products catalog
app.use("/products", productRoutes);


const PORT = config.has("port") ? config.get("port") : process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  Server running at http://localhost:${PORT}`));;