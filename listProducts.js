const mongoose = require('mongoose');
const config = require('./config');
const Product = require('./src/models/Product');

async function run() {
  try {
    await mongoose.connect(config.mongoURI);
    const products = await Product.find({});
    console.log(JSON.stringify(products.map(p => ({ id: p._id, title: p.title })), null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
