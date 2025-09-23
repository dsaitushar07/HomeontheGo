const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");
let mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68d2c00b8977174da960eee4",
  }));
  await Listing.insertMany(initData.data);
  console.log("inserted sucessfully");
};

initDb();
