const { playerSchema, gameSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Player = require('./models/player');
const Game = require('./models/game');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl
      req.flash('error', "You must be signed in first.")
      return res.redirect("/login");
    }
    next();
  };

/*
module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) { // isAdmin is a boolean value in User model
      return next();
    }
    res.status(403).json({ message: "Access restricted to admins only" });
  };
*/

module.exports.validatePlayer = (req, res, next) => {
  const { error } = playerSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

module.exports.validateGame = (req, res, next) => {
  const { error } = gameSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

/* Modify these later to account for league owners, when implemented
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to do that!');
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}
*/


  