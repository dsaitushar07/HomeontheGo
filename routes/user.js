const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../utils/middleware");
const router = express.Router();
const userController = require("../controllers/users");

//handling signup

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.userSignup));

//handling login

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.userLogin)
  );

//handling logout
router.get("/logout", userController.userLogout);

module.exports = router;
