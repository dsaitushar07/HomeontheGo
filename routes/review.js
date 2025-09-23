const express = require("express");
var methodOverride = require("method-override");
const Listing = require("../models/listings.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/reviews");
const { isLoggedIn, isReviewAuthor } = require("../utils/middleware.js");
const reviewController = require("../controllers/reviews.js");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

//handling review
//post request
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);
//delete request
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
