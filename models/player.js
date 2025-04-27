const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: String,
    image: {
        url: String, 
        filename: String
    },
    averagePoints: {type: Number, default: 0}, 
    averageAssists: {type: Number, default: 0}, 
    averageRebounds: {type: Number, default: 0}, 
    averageFantasyPoints: {type: Number, default: 0},
    averageSteals: {type: Number, default: 0},
    averageBlocks: {type: Number, default: 0},
    averageTurnovers: {type: Number, default: 0},
    //Array of games - One to Many relationship
    games: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Game'
        }
    ]

});

// Helper functions for calculations
// Combined helper function
PlayerSchema.methods.calculateAverages = async function() {
    // Populate the games once
    await this.populate('games');

    if (this.games.length > 0) {
        let totals = {
            points: 0,
            assists: 0,
            rebounds: 0,
            fantasyPoints: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0
        };

        for (let game of this.games) {
            totals.points += game.points || 0;
            totals.assists += game.assists || 0;
            totals.rebounds += game.rebounds || 0;
            totals.fantasyPoints += game.fantasyPoints || 0;
            totals.steals += game.steals || 0;
            totals.blocks += game.blocks || 0;
            totals.turnovers += game.turnovers || 0;
        }

        const gameCount = this.games.length;
        this.averagePoints = parseFloat((totals.points / gameCount).toFixed(1));
        this.averageAssists = parseFloat((totals.assists / gameCount).toFixed(1));
        this.averageRebounds = parseFloat((totals.rebounds / gameCount).toFixed(1));
        this.averageFantasyPoints = parseFloat((totals.fantasyPoints / gameCount).toFixed(1));
        this.averageSteals = parseFloat((totals.steals / gameCount).toFixed(1));
        this.averageBlocks = parseFloat((totals.blocks / gameCount).toFixed(1));
        this.averageTurnovers = parseFloat((totals.turnovers / gameCount).toFixed(1));
    } else {
        // No games? Set everything to 0
        this.averagePoints = 0;
        this.averageAssists = 0;
        this.averageRebounds = 0;
        this.averageFantasyPoints = 0;
        this.averageSteals = 0;
        this.averageBlocks = 0;
        this.averageTurnovers = 0;
    }
};

// Pre-save hook
PlayerSchema.pre('save', async function(next) {
    await this.calculateAverages();
    next();
});

module.exports = mongoose.model('Player', PlayerSchema);