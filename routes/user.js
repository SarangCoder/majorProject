const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.get("/signup", userController.renderSignup);

router.post("/signup", wrapAsync(userController.signup));


//for logout
router.get("/logout", userController.logOut);

router.get("/login", userController.renderLoginFrom);

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true, }), userController.login);

module.exports = router;