const multer = require('multer');
const path = require('path');

// Storage for Product Images
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Storage for Payment Proofs
const paymentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/payments');
    },
    filename: (req, file, cb) => {
        cb(null, 'proof-' + Date.now() + path.extname(file.originalname));
    }
});

exports.uploadProduct = multer({ storage: productStorage });
exports.uploadPayment = multer({ storage: paymentStorage });
