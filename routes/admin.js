const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const productController = require('../controllers/ProductController');
const { isAdmin } = require('../middlewares/auth');
const { uploadProduct } = require('../middlewares/upload');

// All routes are protected by isAdmin
router.use(isAdmin);

router.get('/dashboard', adminController.getDashboard);

// User Management
router.get('/users', adminController.getUsers);
router.get('/users/delete/:id', adminController.deleteUser);

// Product Management (Redirect to product routes or handle here)
router.get('/products', productController.adminGetProducts);
router.get('/products/add', productController.getAddProduct);
router.post('/products/add', uploadProduct.single('image'), productController.postAddProduct);
router.get('/products/edit/:id', productController.getEditProduct);
router.post('/products/edit/:id', uploadProduct.single('image'), productController.postEditProduct);
router.get('/products/delete/:id', productController.deleteProduct);

// Order Management
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetail);
router.post('/orders/status/:id', adminController.updateOrderStatus);
router.post('/orders/confirm/:id', adminController.confirmPayment);
router.post('/orders/reject/:id', adminController.rejectPayment);

module.exports = router;
