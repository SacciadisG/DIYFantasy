const express = require('express');
const router = express.Router({mergeParams: true});
const Player = require('../models/player.js');
const Game = require('../models/game.js');
const { isLoggedIn, isAdmin } = require('../middleware');

//Create a New Game
router.get('/', isLoggedIn, async (req, res) => {
    const player = await Player.findById(req.params.id)
    res.render('games/new', {player});
})

//Add a new game
router.post('/', isLoggedIn, async (req, res) => {
    const player = await Player.findById(req.params.id); //Find the player
    const game = new Game(req.body.game); //Create a Game with the input stats
    player.games.push(game);
    await game.save();
    await player.save();
    res.redirect(`/players/${player._id}`); //Backticks help create a template literal, so you concat the string "/players/ + the player id"
})

//Edit a game
router.get('/:gameId/edit', isLoggedIn, async (req, res) => {
    const player = await Player.findById(req.params.id);
    const game = await Game.findById(req.params.gameId);
    res.render('games/edit', {player, game})
})

router.put('/:gameId', isLoggedIn, async(req, res) => {
    const { id, gameId } = req.params; 
    const player = await Player.findById(id);
    const game = await Game.findByIdAndUpdate(gameId, {...req.body.game});
    await game.save();
    await player.save();
    //Remember that the "..." is the spread operator and splits the req body into multiple objects (i.e. our player values)
    res.redirect(`/players/${id}`) //Go back to that player's page
})

//Delete a game
router.delete('/:gameId', isLoggedIn, async (req, res) => {
    const { id, gameId } = req.params;
    const player = await Player.findById(id);
    await Game.findByIdAndDelete(gameId);
    await player.save();
    res.redirect(`/players/${id}`) //Go back to that player's page
})

module.exports = router;