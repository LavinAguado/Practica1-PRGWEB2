const mongoose = require('mongoose');
const config = require('./config');
const Product = require('./src/models/Product');

const imageMap = {
  // Sillas
  "69b5a446ca773a6cb293a5ec": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
  "69b5a4a9ca773a6cb293a5f5": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80",
  // Teclados
  "69b5a446ca773a6cb293a5ee": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
  "69b5a4a9ca773a6cb293a5f7": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
  // Monitores
  "69b5a446ca773a6cb293a5f0": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  "69b5a4a9ca773a6cb293a5f9": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
  // Ratón
  "69b5a446ca773a6cb293a5f2": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80"
};

async function run() {
  try {
    await mongoose.connect(config.mongoURI);
    const products = await Product.find({});
    let count = 0;
    for (const p of products) {
      if (imageMap[p._id]) {
        p.image = imageMap[p._id];
        await p.save();
        count++;
      }
    }
    console.log(`Updated ${count} products with tailored real images.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
