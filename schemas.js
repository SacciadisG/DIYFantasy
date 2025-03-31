const Joi = require('joi');
const { number } = require('joi');

// Note: JOI is for form / model validation. Schemas.js is not the Mongoose Schemas
// but rather, defines/initializes the JOI objects used for data validation

module.exports.playerSchema = Joi.object({
    player: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})