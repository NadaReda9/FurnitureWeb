const express = require('express')
const authController = require('../controllers/authController')
const { identifier } = require('../middlewares/identifier');


const router = express.Router();
router.post('/signup',authController.signup);
router.post('/signin',authController.signin);
router.post('/signout',authController.signout);

router.patch('/send-verification-code',authController.sendVerificationCode) 
router.patch('/send-verification-code',identifier,authController.sendVerificationCode) 
router.patch('/verify-verification-code',identifier,authController.verificationCode) 
router.patch('/changePassword',identifier,authController.changePassword) 
router.patch('/send-forgetPassword-code',authController.sendForgetPasswordCode) 
router.patch('/verify-forgetPassword-code',identifier,authController.verifyForgetPasswordCode)
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports=router;
