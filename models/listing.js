const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
