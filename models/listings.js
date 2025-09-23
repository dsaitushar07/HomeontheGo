const { ref, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const imageSchema = new Schema({
  filename: String,
  url: {
    type: String,
    default:
      "https://unsplash.com/photos/a-sunrise-lights-up-the-rocks-over-the-sea-xYI_dcYIQas",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/a-sunrise-lights-up-the-rocks-over-the-sea-xYI_dcYIQas"
        : v,
  },
});

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/a-sunrise-lights-up-the-rocks-over-the-sea-xYI_dcYIQas",
      set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/a-sunrise-lights-up-the-rocks-over-the-sea-xYI_dcYIQas"
          : v,
    },
  }, // ✅ use defined schema here
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    enum: [
      "Vintage",
      "Amazing Pools",
      "Mountains",
      "Camping",
      "Farms",
      "Arctic",
    ],
    required: true,
  },
});

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     filename: { type: String },
//     url: {
//       type: String,
//       default:
//         "https://unsplash.com/photos/a-sunrise-lights-up-the-rocks-over-the-sea-xYI_dcYIQas",
//       set: (v) =>
//         v === ""
//           ? "https://unsplash.com/photos/a-sunrise-lights-up-the-rocks-over-the-sea-xYI_dcYIQas"
//           : v,
//     },
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
