const express = require('express');
const router = express.Router({mergeParams: true});
const Player = require('../models/player.js');
const Game = require('../models/game.js');
const { isLoggedIn, validateGame } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

// To 'Create New Game' Page
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const player = await Player.findById(req.params.id)
    res.render('games/new', {player});
}))

// Create a New Game
router.post('/', isLoggedIn, validateGame, catchAsync(async (req, res) => {
    const player = await Player.findById(req.params.id); //Find the player
    if (!player) {
        req.flash('error', 'Cannot find that player!');
        return res.redirect('/players');
    }
    const game = new Game(req.body.game); //Create a Game with the input stats
    player.games.push(game);
    await game.save();
    await player.save();
    req.flash('success', 'Created a new game!');
    res.redirect(`/players/${player._id}`); //Backticks help create a template literal, so you concat the string "/players/ + the player id"
}))

//Edit a game
router.get('/:gameId/edit', isLoggedIn, catchAsync(async (req, res) => {
    const player = await Player.findById(req.params.id);
    const game = await Game.findById(req.params.gameId);
    if (!player) {
        req.flash('error', 'Cannot find that player!');
        return res.redirect('/players');
    }
    if (!game) {
        req.flash('error', 'Cannot find that game!');
        return res.redirect('/players');
    }
    res.render('games/edit', {player, game})
}))

router.put('/:gameId', isLoggedIn, catchAsync(async(req, res) => {
    const { id, gameId } = req.params; 
    const player = await Player.findById(id);
    const game = await Game.findByIdAndUpdate(gameId, {...req.body.game});
    await game.save();
    await player.save();
    req.flash('success', 'Game updated successfully!');
    res.redirect(`/players/${id}`) //Go back to that player's page
}))

//Delete a game
router.delete('/:gameId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, gameId } = req.params;
    const player = await Player.findById(id);
    await Game.findByIdAndDelete(gameId);
    await player.save();
    res.redirect(`/players/${id}`) //Go back to that player's page
}))

module.exports = router;