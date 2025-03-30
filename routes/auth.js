const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require('../models/user');
const { isLoggedIn, isAdmin } = require('../middleware');

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    //failureFlash: true // Automatically flashes an error message for failed login
}), (req, res) => {
    //req.flash('success', 'Welcome back!');
    res.redirect('/');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', async (req, res) => {
    try {
        const { username, password, full_name, email } = req.body;
        
        const user = new User({ username, full_name, email });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            //req.flash('success', 'Welcome! Your account has been created.');
            res.redirect('/');
        });
    } catch (e) {
        console.error('Error during registration:', e);
        //req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/auth/register');
    }
})

//Note: Passport's logout requires a callback function
router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;