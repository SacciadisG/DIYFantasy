const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: String,
    image: String, 
    averagePoints: {type: Number, default: 0}, 
    averageAssists: {type: Number, default: 0}, 
    averageRebounds: {type: Number, default: 0}, 
    averageFantasyPoints: {type: Number, default: 0},
    //Array of games - One to Many relationship
    games: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Game'
        }
    ]

});

//Helper functions for calculations
//Calculates a player's avg points based on their games
PlayerSchema.methods.calculateAveragePoints = async function() {
    // Populate the games
    await this.populate('games');

    if (this.games.length > 0) {
        let totalPoints = this.games.reduce((acc, curr) => acc + curr.points, 0); //Reducer fn to do does sum += game.points
        this.averagePoints = parseFloat((totalPoints / this.games.length).toFixed(1)); //Returns a float Number w/ 1 decimal digit
    } else {
        this.averagePoints = 0;
    }
    
    // Save the updated player
    //await this.save();
};

//Calculates a player's avg assists based on their games
PlayerSchema.methods.calculateAverageAssists = async function() {
    // Populate the games
    await this.populate('games');

    if (this.games.length > 0) {
        let totalAssists = this.games.reduce((acc, curr) => acc + curr.assists, 0); //Reducer fn to do does sum += game.assists
        this.averageAssists = parseFloat((totalAssists / this.games.length).toFixed(1)); //Returns a float Number w/ 1 decimal digit
    } else {
        this.averageAssists = 0;
    }
    
    // Save the updated player
    //await this.save();
};

//Calculates a player's avg rebounds based on their games
PlayerSchema.methods.calculateAverageRebounds = async function() {
    // Populate the games
    await this.populate('games');

    if (this.games.length > 0) {
        let totalRebounds = this.games.reduce((acc, curr) => acc + curr.rebounds, 0); //Reducer fn to do does sum += game.rebounds
        this.averageRebounds = parseFloat((totalRebounds / this.games.length).toFixed(1)); //Returns a float Number w/ 1 decimal digit
    } else {
        this.averageRebounds = 0;
    }
    
    // Save the updated player
    //await this.save();
};

//Calculates a player's avg assists based on their games
PlayerSchema.methods.calculateAverageFantasyPoints = async function() {
    // Populate the games
    await this.populate('games');

    if (this.games.length > 0) {
        let totalFantasyPoints = this.games.reduce((acc, curr) => acc + curr.fantasyPoints, 0); //Reducer fn to do does sum += game.fanPts
        this.averageFantasyPoints = parseFloat((totalFantasyPoints / this.games.length).toFixed(1)); //Returns a float Number w/ 1 decimal digit
    } else {
        this.averageFantasyPoints = 0;
    }
    
    // Save the updated player
    //await this.save();
};

//Update a player's avg stats before it's saved
PlayerSchema.pre('save', function(next) {
    this.calculateAveragePoints();
    this.calculateAverageAssists();
    this.calculateAverageRebounds();
    this.calculateAverageFantasyPoints();
    next();
});


module.exports = mongoose.model('Player', PlayerSchema);