const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login - Lama Retail' });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/login');
    }
});

router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register - Lama Retail' });
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters long.');
            return res.redirect('/register');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already in use.');
            return res.redirect('/register');
        }

        const user = new User({ name, email, password });
        await user.save();

        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        req.flash('success', 'Registration successful! Welcome to Lama Retail.');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred during registration.');
        res.redirect('/register');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
