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
        const newQty = parseInt(qty);
        if (isNaN(newQty) || newQty <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].qty = newQty;
        }
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
// --- Checkout ---
exports.checkout = async (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) return res.redirect('/cart');
    
    const user_id = req.session.user.id;
    let total_price = 0;
    
    // Prepare items and calculate total
    const validatedItems = [];
    try {
        for (const item of cart) {
            const price = parseFloat(item.price);
            const qty = parseInt(item.qty);
            if (isNaN(price) || isNaN(qty)) {
                throw new Error(`Invalid data for product: ${item.name}`);
            }
            total_price += price * qty;
            validatedItems.push({
                ...item,
                price: price,
                qty: qty
            });
        }
    } catch (err) {
        console.error('Cart Validation Error:', err.message);
        return res.status(400).send('Invalid Cart Content: ' + err.message);
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create Order
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (user_id, total_price) VALUES (?, ?)', 
            [user_id, total_price]
        );
        const order_id = orderResult.insertId;

        // 2. Create Order Items
        for (const item of validatedItems) {
            await connection.execute(
                'INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)', 
                [order_id, item.product_id, item.qty, item.price]
            );
        }

        await connection.commit();
        req.session.cart = []; // Empty cart
        res.redirect('/orders/' + order_id);
    } catch (err) {
        await connection.rollback();
        console.error('Checkout Transaction Error:', err);
        res.status(500).send('Checkout Error: ' + err.message);
    } finally {
        connection.release();
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
