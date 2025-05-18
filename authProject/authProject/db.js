const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
  console.error('❌ MONGO_URL is not defined in .env file');
  process.exit(1);
}

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = mongoose;
