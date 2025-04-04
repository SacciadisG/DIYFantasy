const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const { isLoggedIn, validatePlayer } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//Index page - All Players
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const players = await Player.find({});
    res.render('players', {players});
}))

//Make a New Player
router.get('/new', isLoggedIn, (req, res) => {
    res.render('players/new');
})

router.post('/', isLoggedIn, validatePlayer, catchAsync(async (req, res) => {
    const player = new Player(req.body.player);
    await player.save();
    req.flash('success', 'Successfully added a new player!');
    res.redirect(`/players/${player._id}`);
}))

//Find a Specific Player
router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const player = await Player.findById(req.params.id).populate('games');
    console.log(player); // For testing purpose - to be removed.
    if (!player) {
        req.flash('error', 'Cannot find that player!');
        return res.redirect('/players');
    }
    res.render('players/show', {player});
}))

//Update a Player
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const player = await Player.findById(req.params.id)
    if (!player) {
        req.flash('error', 'Cannot find that player!');
        return res.redirect('/players');
    }
    res.render('players/edit', {player});
}))

router.put('/:id', isLoggedIn, validatePlayer, catchAsync(async (req, res) => {
    const { id } = req.params;
    const player = await Player.findByIdAndUpdate(id, {...req.body.player}) // The spread operator ("...")  splits the req body into mult. objects
    req.flash('success', 'Successfully updated player!');
    res.redirect(`/players/${player._id}`)
}))

//Delete a Player
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Player.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted player!')
    res.redirect('/players');
}))

module.exports = router;
