const db = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT COUNT(*) as total FROM users WHERE role = "user"');
        const [products] = await db.execute('SELECT COUNT(*) as total FROM products');
        const [orders] = await db.execute('SELECT COUNT(*) as total FROM orders');
        res.render('admin/dashboard', { title: 'Admin Dashboard', stats: { users: users[0].total, products: products[0].total, orders: orders[0].total } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE role = "user" ORDER BY created_at DESC');
        res.render('admin/users', { title: 'Kelola User', users });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.redirect('/admin/users');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getOrders = async (req, res) => {
    try {
        const [orders] = await db.execute('SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC');
        res.render('admin/orders/index', { title: 'Kelola Pesanan', orders });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getOrderDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const [orders] = await db.execute('SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?', [id]);
        if (orders.length === 0) return res.redirect('/admin/orders');
        const [items] = await db.execute('SELECT oi.*, p.name FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?', [id]);
        const [payment] = await db.execute('SELECT * FROM payments WHERE order_id = ?', [id]);
        res.render('admin/orders/detail', { title: 'Detail Pesanan', order: orders[0], items, payment: payment[0] || null });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.redirect('/admin/orders/' + id);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.confirmPayment = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('UPDATE orders SET status = "paid" WHERE id = ?', [id]);
        await db.execute('UPDATE payments SET status = "confirmed" WHERE order_id = ?', [id]);
        res.redirect('/admin/orders/' + id);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.rejectPayment = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('UPDATE orders SET status = "rejected" WHERE id = ?', [id]);
        await db.execute('UPDATE payments SET status = "rejected" WHERE order_id = ?', [id]);
        res.redirect('/admin/orders/' + id);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
