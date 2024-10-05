const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Player = require('./models/player');
const Game = require('./models/game');
const player = require('./models/player');
const app = express(); //Easier to write "app".[method]

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

//HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
});


//PLAYER ROUTES
//Index page - All Players
app.get('/players', async (req, res) => {
    const players = await Player.find({});
    res.render('players', {players});
})

//Make a New Player
app.get('/players/new', (req, res) => {
    res.render('players/new');
})

app.post('/players', async (req, res) => {
    const player = new Player(req.body.player);
    await player.save();
    res.redirect(`/players/${player._id}`);
})

//Find a Specific Player
app.get('/players/:id', async (req, res) => {
    const player = await Player.findById(req.params.id).populate('games');
    console.log(player);
    res.render('players/show', {player});
})

//Update a Player
app.get('/players/:id/edit', async (req, res) => {
    const player = await Player.findById(req.params.id)
    res.render('players/edit', {player});
})

app.put('/players/:id', async (req, res) => {
    const { id } = req.params;
    const player = await Player.findByIdAndUpdate(id, {...req.body.player}) 
    //Remember that the "..." is the spread operator and splits the req body into multiple objects (i.e. our player values)
    res.redirect(`/players/${player._id}`)
})

//Delete a Player
app.delete('/players/:id', async (req, res) => {
    console.log("Please work for the love of god.");
    const { id } = req.params;
    await Player.findByIdAndDelete(id);
    res.redirect('/players');
})

//Create a New Game
app.get('/players/:id/games', async (req, res) => {
    const player = await Player.findById(req.params.id)
    res.render('games/new', {player});
})

//Add a new game
app.post('/players/:id/games', async (req, res) => {
    const player = await Player.findById(req.params.id); //Find the player
    const game = new Game(req.body.game); //Create a Game with the input stats
    player.games.push(game);
    await game.save();
    await player.save();
    res.redirect(`/players/${player._id}`); //Backticks help create a template literal, so you concat the string "/players/ + the player id"
})

//Edit a game
app.get('/players/:id/games/:gameId/edit', async (req, res) => {
    const player = await Player.findById(req.params.id);
    const game = await Game.findById(req.params.gameId);
    res.render('games/edit', {player, game})
})

app.put('/players/:id/games/:gameId', async(req, res) => {
    const { id, gameId } = req.params; 
    const player = await Player.findById(id);
    const game = await Game.findByIdAndUpdate(gameId, {...req.body.game});
    await game.save();
    await player.save();
    //Remember that the "..." is the spread operator and splits the req body into multiple objects (i.e. our player values)
    res.redirect(`/players/${id}`) //Go back to that player's page
})


//Delete a game
//TBD

//Runs server on port 3000
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})
