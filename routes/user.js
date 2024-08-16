const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");


router.route("/signup")
    .get( userController.renderSignup)
    .post( wrapAsync(userController.signup))
    

//for logout
router.route("/login")
    .get(userController.renderLoginFrom)
    .post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true, }), userController.login)

router.get("/logout", userController.logOut);

module.exports = router;