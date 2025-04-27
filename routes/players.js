const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const { isLoggedIn, validatePlayer } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const multer = require('multer');
const { cloudinary, storage, DEFAULT_IMAGE } = require('../cloudinary');
const upload = multer({ storage });

//Index page - All Players
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const players = await Player.find({});
    res.render('players', {players});
}))

//Make a New Player
router.get('/new', isLoggedIn, (req, res) => {
    res.render('players/new');
})

router.post('/new', isLoggedIn, upload.single('image'), /*validatePlayer,*/ catchAsync(async (req, res) => {
    const player = new Player(req.body.player);
    player.image = req.file
      ? { url: req.file.path, filename: req.file.filename }
      : DEFAULT_IMAGE;
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

router.put('/:id', isLoggedIn, upload.single('image'), /*validatePlayer,*/ catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.player
    const player = await Player.findById(id);
    if (req.file) {
        updatedData.image = {
            url: req.file.path, 
            filename: req.file.filename,
        };
        const oldFilename = player.image.filename
        if (oldFilename != DEFAULT_IMAGE.filename) { await cloudinary.uploader.destroy(oldFilename); }
    }
    await Player.updateOne({_id: id}, updatedData)
    // const player = await Player.findByIdAndUpdate(id, updatedData, { new: true });
    req.flash('success', 'Successfully updated player!');
    res.redirect(`/players/${player._id}`);
}))

//Delete a Player
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedPlayer = await Player.findByIdAndDelete(id);
    if (deletedPlayer.image && (deletedPlayer.image.filename != DEFAULT_IMAGE.filename)) {
        await cloudinary.uploader.destroy(deletedPlayer.image.filename);
    }
    req.flash('success', 'Successfully deleted player!')
    res.redirect('/players');
}))

module.exports = router;
