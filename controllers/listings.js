const Listing = require("../models/listings.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
//index route
module.exports.index = async (req, res) => {
  if (req.query) {
    let category = req.query.category; // ✅ extract the string
    let allListings;

    if (category && category !== "Trending") {
      allListings = await Listing.find({ category: category });
    } else {
      allListings = await Listing.find({});
    }
    res.render("./listings/index.ejs", { allListings });
  } else {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }
};

//rendering new form for creating listing
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

//post route for creating listing
module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  console.log(newListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//rendering edit form for listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  } else {
    let originalImgUrl = listing.image.url;
    originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImgUrl });
  }
};

//handling updation of listing
module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//handling deletion of listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Listing deleted");
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

//show listing get route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  } else {
    res.render("./listings/show.ejs", { listing });
  }
};
