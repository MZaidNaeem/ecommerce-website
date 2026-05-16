const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const config = require("config");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const { isLoggedIn, isAdmin } = require("./middlewares/auth");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/product");
const authRoutes = require("./routes/auth");
const session = require("express-session");

require("dotenv").config(); // Load environment variables from .env

const apiAuthRoutes = require("./routes/api/v1/auth");
const apiProductRoutes = require("./routes/api/v1/products");
const apiOrderRoutes = require("./routes/api/v1/orders");
const apiUserRoutes = require("./routes/api/v1/user");
const { verifyToken } = require("./middlewares/apiAuth");

const { MongoStore } = require("connect-mongo");
if (!MongoStore && require("connect-mongo").default) {
    var MongoStoreClass = require("connect-mongo").default;
} else {
    var MongoStoreClass = MongoStore || require("connect-mongo");
}
const flash = require("connect-flash");

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

// Session Setup
app.use(session({
    secret: config.has("sessionSecret") ? config.get("sessionSecret") : "lamaretail_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStoreClass.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_messages = req.flash("success");
    res.locals.error_messages = req.flash("error");
    res.locals.currentUser = req.session.user || null;
    next();
});

// ── Mongoose Schema & Model ──────────────────────────────────────────────────
const Product = require("./models/Product");

// ── Routes ───────────────────────────────────────────────────────────────────

// API Routes
app.use("/api/v1/auth", apiAuthRoutes);
app.use("/api/v1/products", apiProductRoutes);
app.use("/api/v1/orders", verifyToken, apiOrderRoutes);
app.use("/api/v1/user", verifyToken, apiUserRoutes);

// Auth Routes
app.use("/", authRoutes);

// Admin Panel (Protected by isAdmin middleware)
app.use("/admin", isAdmin, adminRoutes);

// Home page
app.get("/", (req, res) => res.render("index"));

// Products catalog
app.use("/products", productRoutes);

// Checkout (Protected by isLoggedIn middleware)
app.get("/checkout", isLoggedIn, (req, res) => {
    res.send("<h1>Checkout Page</h1><p>Welcome to the secure checkout, " + req.session.user.name + "</p>");
});


const PORT = config.has("port") ? config.get("port") : process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  Server running at http://localhost:${PORT}`));;