const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { isAuth } = require('../middlewares/auth');
const { uploadPayment } = require('../middlewares/upload');

router.get('/', userController.getHome);
router.get('/cart', userController.getCart);
router.post('/cart/add', userController.addToCart);
router.post('/cart/update', userController.updateCart);
router.get('/cart/remove/:product_id', userController.removeFromCart);

router.get('/checkout', isAuth, userController.checkout);
router.get('/orders', isAuth, userController.getMyOrders);
router.get('/orders/:id', isAuth, userController.getOrderDetail);
router.post('/orders/upload-proof', isAuth, uploadPayment.single('proof'), userController.uploadProof);

module.exports = router;
