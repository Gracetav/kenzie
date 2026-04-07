const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { isAdmin } = require('../middlewares/auth');
const { uploadProduct } = require('../middlewares/upload');

// Public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductDetail);

// Admin Management
router.get('/admin/list', isAdmin, productController.adminGetProducts);
router.get('/admin/add', isAdmin, productController.getAddProduct);
router.post('/admin/add', isAdmin, uploadProduct.single('image'), productController.postAddProduct);
router.get('/admin/edit/:id', isAdmin, productController.getEditProduct);
router.post('/admin/edit/:id', isAdmin, uploadProduct.single('image'), productController.postEditProduct);
router.get('/admin/delete/:id', isAdmin, productController.deleteProduct);

module.exports = router;
