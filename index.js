const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express(); 

// Models
const User = require('./models/user');
const Player = require('./models/player');
const Game = require('./models/game');

// Routes
const players = require('./routes/players');
const games = require('./routes/games');
const auth = require('./routes/auth');

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/fantasy');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); //Listens for "Error" event & triggers if found
db.once("open", () => { //Listens for "Open" event, i.e. an established connection with MongoDB & triggers if found
    console.log("Database connected");
});

app.engine('ejs', ejsMate); //Use ejsMate instead of default express engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true })); //This helps with parsing URL data - good to include for our forms
app.use(methodOverride('_method')); 
app.use(express.static(path.join(__dirname, 'public')));

//Passport & Session Setup
const sessionConfig = {
    secret: 'DIYFantasy', // This will be moved to an .env file soon enough
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig)); //Setup express session
app.use(flash());

app.use(passport.initialize()); //Initialize passport framework
app.use(passport.session()); //Be sure to 'use' this after we use 'session'
passport.use(new LocalStrategy(User.authenticate())); //Telling passport to use the passport-given authentication method for our User model
passport.serializeUser(User.serializeUser()); //How to store a user in the session i.e. log them in & keep them logged in
passport.deserializeUser(User.deserializeUser()); //How to remove a user from a session i.e. log them out

app.use((req, res, next) => {
    console.log(req.session) // For testing purposes
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Routed Pages here
app.use('/players', players)
app.use('/players/:id/games', games)
app.use('/auth', auth)

//HOME PAGE
app.get('/', isLoggedIn, (req, res) => {
    res.render('home')
});

// Unidentified routes get their errors handled via this middleware & the custom Error class
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; //Default status code is 500
    if (!err.message) err.message = "Something went wrong!"
    res.status(statusCode).render('error', { err })
})

//Runs server on port 3000
app.listen(3000, () => {
    console.log("App is listening on Port 3000!")
})
