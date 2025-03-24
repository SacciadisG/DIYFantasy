const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Player = require('./models/player');
const Game = require('./models/game');
const app = express(); //Easier to write "app". [method]

const players = require('./routes/players');
const games = require('./routes/games');

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/fantasy');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:")); //Listens for "Error" event & triggers if found
db.once("open", () => { //Listens for "Open" event, i.e. an established connection with MongoDB & triggers if found
    console.log("Database connected");
});

//Remember to npm install path and ejs and ejs mate for this
app.engine('ejs', ejsMate); //Use ejsMate instead of default express engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//This helps with parsing URL data - good to include for our forms
app.use(express.urlencoded({ extended: true }));
//Remember to npm install method-override for this
app.use(methodOverride('_method'));


//Routed Pages here
app.use('/players', players)
app.use('/players/:id/games', games)

//HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
});

//Runs server on port 3000
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
