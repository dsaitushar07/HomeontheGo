const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.userSignup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const regUser = await User.register(newUser, password);
    console.log(regUser);
    req.login(regUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome, ${username}!`);
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.userLogin = async (req, res) => {
  let { username } = req.body;
  req.flash("success", `Welcome, ${username}!`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully Logged Out");
    res.redirect("/listings");
  });
};
