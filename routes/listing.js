const express = require("express");

const router = express.Router();
const Reviews = require("../models/reviews.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const listingSchema = require("../schema.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js");


router.route("/")
    //Index Route
    .get(wrapAsync(listingController.index))
    // create Route 
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

    //New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    // Show Route
    .get(wrapAsync(listingController.showListing))
    // update Route
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))




router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

module.exports = router;