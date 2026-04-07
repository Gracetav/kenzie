const db = require('../config/db');

// --- User Face ---
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        res.render('user/products', { title: 'Daftar Produk', products });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getProductDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (products.length === 0) return res.status(404).render('404', { title: 'Produk Tidak Ditemukan', layout: false });
        res.render('user/product-detail', { title: products[0].name, product: products[0] });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// --- Admin Face ---
exports.adminGetProducts = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        res.render('admin/products/index', { title: 'Kelola Produk', products });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getAddProduct = (req, res) => {
    res.render('admin/products/add', { title: 'Tambah Produk' });
};

exports.postAddProduct = async (req, res) => {
    const { name, price, stock, description } = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        await db.execute('INSERT INTO products (name, price, stock, description, image) VALUES (?, ?, ?, ?, ?)', [name, price, stock, description, image]);
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.getEditProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (products.length === 0) res.redirect('/admin/products');
        res.render('admin/products/edit', { title: 'Edit Produk', product: products[0] });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.postEditProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, description } = req.body;
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        let image = products[0].image;
        if (req.file) image = req.file.filename;

        await db.execute('UPDATE products SET name = ?, price = ?, stock = ?, description = ?, image = ? WHERE id = ?', [name, price, stock, description, image, id]);
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM products WHERE id = ?', [id]);
        res.redirect('/admin/products');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
