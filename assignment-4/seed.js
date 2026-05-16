const mongoose = require("mongoose");

const config = require("config");
const MONGO_URI = config.has("mongoURI") ? config.get("mongoURI") : process.env.MONGO_URI || "mongodb://localhost:27017/lamaretail";

const Product = require("./models/Product");

const products = [
  // ── NEW ──
  { name: "COTTON STRIPE SHIRT DRESS", price: 8450, category: "NEW", rating: 4.5, stock: 20, image1: "/img/hero/product1-1.jpg", image2: "/img/hero/product1-2.jpg" },
  { name: "SALMON PINSTRIPE SHIRT", price: 5450, category: "NEW", rating: 4.2, stock: 35, image1: "/img/hero/product2-1.jpg", image2: "/img/hero/product2-2.jpg" },
  { name: "SLOUCHY EASE PANTS", price: 7950, category: "NEW", rating: 4.7, stock: 18, image1: "/img/hero/product3-1.jpg", image2: "/img/hero/product3-2.jpg" },
  { name: "THE ERRAND TOTE", price: 11950, category: "NEW", rating: 4.8, stock: 12, image1: "/img/hero/product4-1.jpg", image2: "/img/hero/product4-2.jpg" },
  { name: "ONE SIZE COTTON SHIRT DRESS", price: 9950, category: "NEW", rating: 4.3, stock: 22, image1: "/img/hero/product5-1.jpg", image2: "/img/hero/product5-2.jpg" },

  // ── SHOES ──
  { name: "EASY PARTY TOE SLIDES", price: 5450, category: "SHOES", rating: 4.4, stock: 50, image1: "/img/shoes/product1-1.jpg", image2: "/img/shoes/product1-2.jpg" },
  { name: "LACE-UP KNIT SNEAKERS", price: 14950, category: "SHOES", rating: 4.8, stock: 10, image1: "/img/shoes/product2-1.jpg", image2: "/img/shoes/product2-2.jpg" },
  { name: "VERONA MINI HEELS", price: 7950, category: "SHOES", rating: 4.5, stock: 18, image1: "/img/shoes/product3-1.jpg", image2: "/img/shoes/product3-2.jpg" },
  { name: "LIFESTYLE SNEAKERS", price: 11950, category: "SHOES", rating: 4.6, stock: 14, image1: "/img/shoes/product4-1.jpg", image2: "/img/shoes/product4-2.jpg" },
  { name: "LITTLE VENICE", price: 9950, category: "SHOES", rating: 4.3, stock: 22, image1: "/img/shoes/product5-1.jpg", image2: "/img/shoes/product5-2.jpg" },

  // ── TOPS, BLOUSES & SHIRTS ──
  { name: "ONE SIZE COTTON SHIRT DRESS", price: 9950, category: "TOPS, BLOUSES & SHIRTS", rating: 4.7, stock: 12, image1: "/img/season/product1-1.jpg", image2: "/img/season/product1-2.jpg" },
  { name: "SABLE EASY SHIRT", price: 7450, category: "TOPS, BLOUSES & SHIRTS", rating: 4.5, stock: 16, image1: "/img/season/product2-1.jpg", image2: "/img/season/product2-2.jpg" },
  { name: "DROPLET NECK TOP", price: 4950, category: "TOPS, BLOUSES & SHIRTS", rating: 4.6, stock: 9, image1: "/img/season/product3-1.jpg", image2: "/img/season/product3-2.jpg" },
  { name: "OVERSIZED COTTON BLOUSE", price: 8450, category: "TOPS, BLOUSES & SHIRTS", rating: 4.8, stock: 7, image1: "/img/season/product4-1.jpg", image2: "/img/season/product4-2.jpg" },
  { name: "OVERSIZED COTTON BLOUSE 2", price: 8450, category: "TOPS, BLOUSES & SHIRTS", rating: 4.4, stock: 14, image1: "/img/season/product5-1.jpg", image2: "/img/season/product5-2.jpg" },

  // ── POLOS & SAFARIS ──
  { name: "LUXE KNIT POLO", price: 6950, category: "POLOS & SAFARIS", rating: 4.9, stock: 30, image1: "/img/luxury/product1-1.jpg", image2: "/img/luxury/product1-2.jpg" },
  { name: "STITCH DETAIL SAFARI", price: 7450, category: "POLOS & SAFARIS", rating: 4.6, stock: 50, image1: "/img/luxury/product2-1.jpg", image2: "/img/luxury/product2-2.jpg" },
  { name: "SOFT WEAVE POLO", price: 7450, category: "POLOS & SAFARIS", rating: 4.3, stock: 35, image1: "/img/luxury/product3-1.jpg", image2: "/img/luxury/product3-2.jpg" },
  { name: "ESSENTIAL POLO", price: 6950, category: "POLOS & SAFARIS", rating: 4.2, stock: 40, image1: "/img/luxury/product4-1.jpg", image2: "/img/luxury/product4-2.jpg" },
  { name: "WASHED EFFECT SAFARI SHIRT", price: 8450, category: "POLOS & SAFARIS", rating: 4.5, stock: 25, image1: "/img/luxury/product5-1.jpg", image2: "/img/luxury/product5-2.jpg" },

  // ── BAGS ──
  { name: "MARBELLA CROSSBODY BAG", price: 9950, category: "BAGS", rating: 4.7, stock: 12, image1: "/img/bag/product1-1.jpg", image2: "/img/bag/product1-2.jpg" },
  { name: "CITY SHOULDER BAG", price: 8950, category: "BAGS", rating: 4.5, stock: 16, image1: "/img/bag/product2-1.jpg", image2: "/img/bag/product2-2.jpg" },
  { name: "VIGO DAY TOTE", price: 11950, category: "BAGS", rating: 4.6, stock: 9, image1: "/img/bag/product3-1.jpg", image2: "/img/bag/product3-2.jpg" },
  { name: "THE ERRAND TOTE", price: 11950, category: "BAGS", rating: 4.8, stock: 7, image1: "/img/bag/product4-1.jpg", image2: "/img/bag/product4-2.jpg" },
  { name: "AFTER HOURS SHOULDER BAG", price: 8950, category: "BAGS", rating: 4.4, stock: 14, image1: "/img/bag/product5-1.jpg", image2: "/img/bag/product5-2.jpg" }
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  console.log("Cleared existing products");

  await Product.insertMany(products);
  console.log(`✅  Inserted ${products.length} products`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
