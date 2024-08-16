const express = require("express");
const router = express.Router({mergeParams : true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
// const { reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {validateReview , isLoggedIn ,isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js");



// Reviews
//Post Route
router.post("/", isLoggedIn,validateReview , wrapAsync(reviewController.createReview));

// delete review route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.distroyReview))

module.exports = router;