// Import Express framework (used to create routes and server)
const express = require("express");

// Create a new router object (mini express app for handling routes separately)
const router = express.Router();

// Multer is used for handling file uploads (images in your case)
const multer = require("multer");

// Path module helps in working with file and directory paths safely
const path = require("path");

// fs (File System) module lets you read/write/delete files on the server
const fs = require("fs");

// Import Product model from MongoDB (Mongoose schema)
const Product = require("../../models/Product");


// ─────────────────────────────────────────────────────────────
// 🔼 MULTER SETUP (for uploading images)
// ─────────────────────────────────────────────────────────────

// Define where and how uploaded files should be stored
const storage = multer.diskStorage({

  // Set destination folder for uploaded files
  destination: function (req, file, cb) {
    // cb = callback (null = no error, second param = folder path)
    cb(null, "public/uploads/");
  },

  // Define how uploaded files should be named
  filename: function (req, file, cb) {
    // Create a unique suffix using timestamp + random number
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Final filename: fieldname + unique suffix + original extension
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Create multer instance with defined storage rules
const upload = multer({ storage: storage });


// Handle multiple file fields (image1 and image2)
const cpUpload = upload.fields([
  { name: "image1", maxCount: 1 }, // one file for image1
  { name: "image2", maxCount: 1 }, // one file for image2
]);


// ─────────────────────────────────────────────────────────────
// 🏠 DASHBOARD ROUTE (Show all products)
// ─────────────────────────────────────────────────────────────

// GET /admin → show admin dashboard
router.get("/", async (req, res) => {
  try {
    // Fetch all products from MongoDB
    // sort({ _id: -1 }) → newest products first
    const products = await Product.find().sort({ _id: -1 });

    // Render dashboard view and pass products data to EJS
    res.render("admin/dashboard", {
      layout: "admin-layout",
      products,
    });

  } catch (err) {
    // If error occurs, log it
    console.error(err);

    // Send server error response
    res.status(500).send("Server error fetching products.");
  }
});


// ─────────────────────────────────────────────────────────────
// ➕ CREATE PRODUCT PAGE (GET form)
// ─────────────────────────────────────────────────────────────

// GET /admin/create → show product creation form
router.get("/create", (req, res) => {
  res.render("admin/create", {
    layout: "admin-layout",
  });
});


// ─────────────────────────────────────────────────────────────
// ➕ CREATE PRODUCT (POST form submit)
// ─────────────────────────────────────────────────────────────

router.post("/create", cpUpload, async (req, res) => {
  try {

    // Extract text fields from form body
    const { name, price, category, rating, stock } = req.body;

    // Variables for storing uploaded image paths
    let image1 = "";
    let image2 = "";

    // If image1 uploaded, save its path
    if (req.files["image1"] && req.files["image1"].length > 0) {
      image1 = "/uploads/" + req.files["image1"][0].filename;
    }

    // If image2 uploaded, save its path
    if (req.files["image2"] && req.files["image2"].length > 0) {
      image2 = "/uploads/" + req.files["image2"][0].filename;
    }

    // Create new product object
    const newProduct = new Product({
      name,
      price,
      category,

      // If rating not provided → default to 0
      rating: rating || 0,

      // If stock not provided → default to 0
      stock: stock || 0,

      image1,
      image2,
    });

    // Save product to MongoDB
    await newProduct.save();

    // Redirect back to admin dashboard
    res.redirect("/admin");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating product.");
  }
});


// ─────────────────────────────────────────────────────────────
// ✏️ EDIT PRODUCT PAGE (GET existing data)
// ─────────────────────────────────────────────────────────────

router.get("/edit/:id", async (req, res) => {
  try {

    // Find product by ID from URL parameter
    const product = await Product.findById(req.params.id);

    // If no product found → return 404
    if (!product) return res.status(404).send("Product not found");

    // Render edit page with existing product data
    res.render("admin/edit", {
      layout: "admin-layout",
      product,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product for edit.");
  }
});


// ─────────────────────────────────────────────────────────────
// ✏️ UPDATE PRODUCT (PUT request)
// ─────────────────────────────────────────────────────────────

router.put("/edit/:id", cpUpload, async (req, res) => {
  try {

    // Extract updated fields
    const { name, price, category, rating, stock } = req.body;

    // Create object that will update DB
    const updateData = {
      name,
      price,
      category,
      rating: rating || 0,
      stock: stock || 0,
    };

    // If new image1 uploaded → update it
    if (req.files["image1"] && req.files["image1"].length > 0) {
      updateData.image1 =
        "/uploads/" + req.files["image1"][0].filename;
    }

    // If new image2 uploaded → update it
    if (req.files["image2"] && req.files["image2"].length > 0) {
      updateData.image2 =
        "/uploads/" + req.files["image2"][0].filename;
    }

    // Update product in MongoDB using ID
    await Product.findByIdAndUpdate(req.params.id, updateData);

    // Redirect back to admin page
    res.redirect("/admin");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product.");
  }
});


// ─────────────────────────────────────────────────────────────
// ❌ DELETE PRODUCT
// ─────────────────────────────────────────────────────────────

router.delete("/delete/:id", async (req, res) => {
  try {

    // Find product in database
    const product = await Product.findById(req.params.id);

    if (product) {

      // If image1 exists and is stored locally
      if (product.image1 && product.image1.startsWith("/uploads/")) {

        // Create relative file path from project root
        const imgPath1 = path.join(
          "public",
          product.image1
        );

        // If file exists → delete it from disk
        if (fs.existsSync(imgPath1)) {
          fs.unlinkSync(imgPath1);
        }
      }

      // Same process for image2
      if (product.image2 && product.image2.startsWith("/uploads/")) {
        const imgPath2 = path.join(
          "public",
          product.image2
        );

        if (fs.existsSync(imgPath2)) {
          fs.unlinkSync(imgPath2);
        }
      }

      // Finally delete product from MongoDB
      await Product.findByIdAndDelete(req.params.id);
    }

    // Redirect back to admin dashboard
    res.redirect("/admin");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
});


// Export router so it can be used in main server.js file
module.exports = router;