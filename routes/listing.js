const express = require("express");
const path = require("path");
var methodOverride = require("method-override");
const Listing = require("../models/listings.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const ExpressError = require("../utils/expressError");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/reviews");
const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const {
  isLoggedIn,
  isOwner,
  saveRedirectUrl,
  saveOriginalUrl,
} = require("../utils/middleware.js");
const listingController = require("../controllers/listings.js");

const router = express.Router();

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

//index route

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router
  .route("/:id")
  .get(
    saveOriginalUrl,
    saveRedirectUrl,
    wrapAsync(listingController.showListing)
  )
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    isOwner,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
