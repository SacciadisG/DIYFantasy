const Joi = require('joi');
const { number } = require('joi');

// Note: JOI is for form / model validation. Schemas.js is not the Mongoose Schemas
// but rather, defines/initializes the JOI objects used for data validation

module.exports.playerSchema = Joi.object({
    player: Joi.object({
        name: Joi.string().required()
    }).required()
});

module.exports.gameSchema = Joi.object({
    game: Joi.object({
        points: Joi.number().required().min(0),
        assists: Joi.number().required().min(0),
        rebounds: Joi.number().required().min(0),
        steals: Joi.number().required().min(0),
        blocks: Joi.number().required().min(0),
        turnovers: Joi.number().required().min(0),
        fga: Joi.number().required().min(0),
        fgm: Joi.number().required().min(0),
        tpa: Joi.number().required().min(0),
        tpm: Joi.number().required().min(0)
    }).required()
})