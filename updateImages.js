const mongoose = require('mongoose');
const config = require('./config');
const Product = require('./src/models/Product');

async function run() {
  try {
    await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');
    const products = await Product.find({});
    let count = 0;
    for (const p of products) {
      // Set image uniquely based on product id to be consistent 
      p.image = `https://picsum.photos/seed/${p._id}/600/400`;
      await p.save();
      count++;
    }
    console.log(`Updated ${count} products with new images.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
