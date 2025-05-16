// require('dotenv').config();  

// const express = require("express");
// const helmet = require("helmet");
// const cors = require('cors');
// const cookieParser = require("cookie-parser");
// const mongoose = require('mongoose');

// require('./db'); 

// const authRouter = require('./routes/authRouter');
// const productRoutes = require('./routes/Products');
// const cartRoutes = require('./routes/cartRouter');
// const feedbackRouter = require('./routes/feedbackRouter');


// const app = express();


// // Middlewares
// app.use(cors());
// app.use(helmet());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());



// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));


// // Routes
// app.get('/', (req, res) => {
//   res.json({ message: "Hello from server" });
// });

// app.use('/api/auth', authRouter);
// app.use('/api/products', productRoutes);

// app.use('/api/cart', cartRoutes);

// app.use('/api/feedback', feedbackRouter); 

// // Start Server
// const PORT = process.env.PORT || 5000; 
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${process.env.port}`);
// });


require('dotenv').config();  

const express = require("express");
const helmet = require("helmet");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');

require('./db'); 

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

//mongoose.connect(process.env.MONGO_URL)
  //.then(() => console.log('✅ MongoDB connected'))
  //.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Hello from server" });
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.use('/api/feedback', feedbackRoutes);

// Start Server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});






