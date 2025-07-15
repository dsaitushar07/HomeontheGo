const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
var methodOverride = require("method-override");
const Listing = require("./models/listing");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const ExpressError = require("./utils/expressError");
const { listingSchema } = require("./schema.js");

const app = express();
let port = 8080;
let mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

app.use(express.urlencoded({ extended: true })); // For form data
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

app.get("/", (req, res) => {
  res.send("root is working");
});

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
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

//new route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log("created");
    console.log(newListing);
    res.redirect("/listings");
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

//update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log("deleted");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//show listing route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
  })
);

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => console.log("Listening at port:", port));

// const mongoose = require("mongoose");
// const express = require("express");
// const path = require("path");
// const methodOverride = require("method-override");
// const Listing = require("./models/listing");
// const ejsMate = require("ejs-mate");

// const app = express();
// const port = 8080;
// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(methodOverride("_method"));

// // View engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.engine("ejs", ejsMate);

// // Database connection
// async function main() {
//   try {
//     await mongoose.connect(mongoUrl);
//     console.log("Database connected successfully");
//   } catch (err) {
//     console.error("Database connection error:", err);
//   }
// }

// main();

// // Utility function for async error handling
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

// // Routes
// app.get("/", (req, res) => {
//   res.send("Root is working");
// });

// // Index route - show all listings
// app.get(
//   "/listings",
//   asyncHandler(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index", { allListings });
//   })
// );

// // New listing form - MUST come before /:id route
// app.get("/listings/new", (req, res) => {
//   res.render("listings/new");
// });

// // Create new listing
// app.post(
//   "/listings",
//   asyncHandler(async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     console.log("Listing created:", newListing);
//     res.redirect("/listings");
//   })
// );

// // Edit listing form
// app.get(
//   "/listings/:id/edit",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       return res.status(404).send("Listing not found");
//     }
//     res.render("listings/edit", { listing });
//   })
// );

// // Update listing
// app.put(
//   "/listings/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndUpdate(id, req.body.listing);
//     res.redirect(`/listings/${id}`);
//   })
// );

// // Delete listing
// app.delete(
//   "/listings/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const deletedListing = await Listing.findByIdAndDelete(id);
//     if (deletedListing) {
//       console.log("Listing deleted:", deletedListing);
//     }
//     res.redirect("/listings");
//   })
// );

// // Show individual listing - MUST come after /new route
// app.get(
//   "/listings/:id",
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       return res.status(404).send("Listing not found");
//     }
//     res.render("listings/show", { listing });
//   })
// );

// // 404 handler
// app.all("*", (req, res) => {
//   res.status(404).send("Page Not Found");
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error("Error:", err);
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "Something went wrong";
//   res.status(statusCode).send(message);
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
