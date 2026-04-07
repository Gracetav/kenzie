const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.getLogin = (req, res) => {
    res.render('auth/login', { title: 'Login', layout: false });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.render('auth/login', { title: 'Login', error: 'Invalid Email or Password', layout: false });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', { title: 'Login', error: 'Invalid Email or Password', layout: false });
        }
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        if (user.role === 'admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.getRegister = (req, res) => {
    res.render('auth/register', { title: 'Register', layout: false });
};

exports.postRegister = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [exists] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (exists.length > 0) {
            return res.render('auth/register', { title: 'Register', error: 'Email already exists', layout: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'user']);
        res.redirect('/auth/login');
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};
