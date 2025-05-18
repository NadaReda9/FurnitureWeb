require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('./db'); // This handles mongoose connection

const authRouter = require('./routes/authRouter');
const productRoutes = require('./routes/Products');
const cartRoutes = require('./routes/cartRouter');
const feedbackRoutes = require('./routes/feedbackRouter');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Hello from server" });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/feedback', feedbackRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
