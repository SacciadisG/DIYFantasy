const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    //date: {type: Date, default: n/a } - to implement later
    fantasyPoints: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    rebounds: { type: Number, default: 0 },
    steals: {type: Number, default: 0 },
    blocks: { type: Number, default: 0 },
    turnovers: { type: Number, default: 0 },
    //Advanced Stats
    //Field Goals - Attempted, Made, Percentage
    fga: { type: Number, default: 0 },
    fgm: {type: Number, default: 0 },
    fgp: {type: Number, default: 0 },
    //Threes - Attempted, Made, Percentage
    tpa: { type: Number, default: 0 },
    tpm: {type: Number, default: 0 },
    tpp: {type: Number, default: 0 }

})

//Helper functions for calculations
//Calculate FGP
gameSchema.methods.calculateFGP = function() {
    //Calculate fgp if there's 1+ fgp, else default to 0
    this.fgp = this.fga > 0 ? (this.fgm / this.fga * 100).toFixed(2) : 0;
};

//Calculate TPP
gameSchema.methods.calculateTPP = function() {
    //Calculate tpp if there's 1+ tpa, else default to 0
    this.tpp = this.tpa > 0 ? (this.tpm / this.tpa * 100).toFixed(2) : 0;
};

//Calculate Fantasy Points
gameSchema.methods.calculateFantasyPoints = function() {
    //Pts = 1; Ast = 0.8; Reb = 0.7; Stl = 2; Blk = 2; TO = -0.5;
    this.fantasyPoints = ((this.points * 1) + (this.assists * 0.8) + (this.rebounds * 0.7) + 
                         (this.steals * 2) + (this.blocks * 2) - (this.turnovers * 0.5)).toFixed(1);
};

//Ensure calculations are performed before saving
gameSchema.pre('save', function(next) {
    this.calculateFGP();
    this.calculateTPP();
    this.calculateFantasyPoints();
    next();
});

//Export the model & its helper functions to the index page 
module.exports = mongoose.model('Game', gameSchema);