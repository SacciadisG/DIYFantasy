const express = require("express");
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', (req, res) => {
    res.send("Login POST works!");
})

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', (req, res) => {
    res.send("Registration POST works!");
})

module.exports = router;