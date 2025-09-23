const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // <-- save requested page
    req.flash("error", "Please Login to perform this action");
    return res.redirect("/login");
  }
  next();
};

const saveOriginalUrl = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

async function isOwner(req, res, next) {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You don't have the authorization to perform this action"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
}

async function isReviewAuthor(req, res, next) {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash(
      "error",
      "You don't have the authorization to perform this action"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  isReviewAuthor,
  saveOriginalUrl,
};
