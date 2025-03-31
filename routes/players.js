const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const { isLoggedIn, isAdmin } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//PLAYER ROUTES
//Index page - All Players
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const players = await Player.find({});
    res.render('players', {players});
}))

//Make a New Player
router.get('/new', isLoggedIn, (req, res) => {
    res.render('players/new');
})

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
    const player = new Player(req.body.player);
    await player.save();
    res.redirect(`/players/${player._id}`);
}))

//Find a Specific Player
router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const player = await Player.findById(req.params.id).populate('games');
    console.log(player);
    res.render('players/show', {player});
}))

//Update a Player
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const player = await Player.findById(req.params.id)
    res.render('players/edit', {player});
}))

router.put('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findByIdAndUpdate(id, {...req.body.player}) 
    //Remember that the "..." is the spread operator and splits the req body into multiple objects (i.e. our player values)
    res.redirect(`/players/${player._id}`)
}))

//Delete a Player
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Player.findByIdAndDelete(id);
    res.redirect('/players');
}))

module.exports = router;
