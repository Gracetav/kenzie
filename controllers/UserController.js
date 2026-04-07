const db = require('../config/db');

exports.getHome = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC LIMIT 8');
        res.render('user/home', { title: 'Selamat Datang', products });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// --- Cart Logic ---
exports.addToCart = (req, res) => {
    const { product_id, name, price, image } = req.body;
    let cart = req.session.cart || [];
    const index = cart.findIndex(item => item.product_id == product_id);
    if (index !== -1) {
        cart[index].qty += 1;
    } else {
        cart.push({ product_id, name, price, image, qty: 1 });
    }
    req.session.cart = cart;
    res.redirect('/cart');
};

exports.getCart = (req, res) => {
    const cart = req.session.cart || [];
    let total_price = 0;
    cart.forEach(item => total_price += parseFloat(item.price) * item.qty);
    res.render('user/cart', { title: 'Keranjang Belanja', cart, total_price });
};

exports.updateCart = (req, res) => {
    const { product_id, qty } = req.body;
    let cart = req.session.cart || [];
    const index = cart.findIndex(item => item.product_id == product_id);
    if (index !== -1) {
        cart[index].qty = parseInt(qty);
        if (cart[index].qty <= 0) cart.splice(index, 1);
    }
    req.session.cart = cart;
    res.redirect('/cart');
};

exports.removeFromCart = (req, res) => {
    const { product_id } = req.params;
    let cart = req.session.cart || [];
    req.session.cart = cart.filter(item => item.product_id != product_id);
    res.redirect('/cart');
};

// --- Checkout ---
exports.checkout = async (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/cart');
    const user_id = req.session.user.id;
    let total_price = 0;
    cart.forEach(item => total_price += parseFloat(item.price) * item.qty);

    try {
        const [order] = await db.execute('INSERT INTO orders (user_id, total_price) VALUES (?, ?)', [user_id, total_price]);
        const order_id = order.insertId;
        for (const item of cart) {
            await db.execute('INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)', [order_id, item.product_id, item.qty, item.price]);
        }
        req.session.cart = []; // Empty cart
        res.redirect('/orders/' + order_id);
    } catch (err) {
        console.log(err);
        res.status(500).send('Checkout Error');
    }
};

exports.getMyOrders = async (req, res) => {
    const user_id = req.session.user.id;
    try {
        const [orders] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
        res.render('user/orders', { title: 'Pesanan Saya', orders });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getOrderDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        if (orders.length === 0) return res.redirect('/orders');
        const [items] = await db.execute('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [id]);
        const [payment] = await db.execute('SELECT * FROM payments WHERE order_id = ?', [id]);
        res.render('user/order-detail', { title: 'Detail Pesanan', order: orders[0], items, payment: payment[0] || null });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.uploadProof = async (req, res) => {
    const { order_id } = req.body;
    const proof = req.file ? req.file.filename : null;
    if (!proof) return res.redirect('/orders/' + order_id);
    try {
        await db.execute('INSERT INTO payments (order_id, proof) VALUES (?, ?)', [order_id, proof]);
        res.redirect('/orders/' + order_id);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
