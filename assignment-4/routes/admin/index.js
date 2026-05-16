const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../../models/Product");

// ── Multer Setup ─────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
const cpUpload = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
]);

// ── Dashboard ────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.render("admin/dashboard", { layout: "admin-layout", products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error fetching products.");
  }
});

// ── Create Product ───────────────────────────────────────────────────────────
router.get("/create", (req, res) => {
  res.render("admin/create", { layout: "admin-layout" });
});

router.post("/create", cpUpload, async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;
    
    let image1 = "";
    let image2 = "";

    if (req.files["image1"] && req.files["image1"].length > 0) {
      image1 = "/uploads/" + req.files["image1"][0].filename;
    }
    if (req.files["image2"] && req.files["image2"].length > 0) {
      image2 = "/uploads/" + req.files["image2"][0].filename;
    }

    const newProduct = new Product({
      name,
      price,
      category,
      rating: rating || 0,
      stock: stock || 0,
      image1,
      image2,
    });

    await newProduct.save();
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating product.");
  }
});

// ── Edit Product ─────────────────────────────────────────────────────────────
router.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.render("admin/edit", { layout: "admin-layout", product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching product for edit.");
  }
});

router.put("/edit/:id", cpUpload, async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;
    
    const updateData = {
      name,
      price,
      category,
      rating: rating || 0,
      stock: stock || 0,
    };

    if (req.files["image1"] && req.files["image1"].length > 0) {
      updateData.image1 = "/uploads/" + req.files["image1"][0].filename;
    }
    if (req.files["image2"] && req.files["image2"].length > 0) {
      updateData.image2 = "/uploads/" + req.files["image2"][0].filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product.");
  }
});

// ── Delete Product ───────────────────────────────────────────────────────────
router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (product.image1 && product.image1.startsWith("/uploads/")) {
        const imgPath1 = path.join(__dirname, "../../public", product.image1);
        if (fs.existsSync(imgPath1)) {
          fs.unlinkSync(imgPath1);
        }
      }
      if (product.image2 && product.image2.startsWith("/uploads/")) {
        const imgPath2 = path.join(__dirname, "../../public", product.image2);
        if (fs.existsSync(imgPath2)) {
          fs.unlinkSync(imgPath2);
        }
      }
      await Product.findByIdAndDelete(req.params.id);
    }
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting product.");
  }
});

module.exports = router;
