const express = require('express');
const router = express.Router();
const Product = require('../models/Products'); 

// ✅ إضافة منتج جديد
router.post('/add', async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  if (!name || !price || !description || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newProduct = new Product({ name, price, description, imageUrl });
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully!', product: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while saving product.' });
  }
});

// ✅ جلب كل المنتجات
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
});

// حذف كل المنتجات
router.delete('/deleteAll', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: 'All products deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// جلب تفاصيل منتج واحد
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product); 

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching product details.' });
  }
});




module.exports = router;
