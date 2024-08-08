const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req,res,next)  => {
    let error = listingSchema.validate(req.body);
    
    if(error){
        // let errMgs = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};


//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

// Show Route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist!");
        res.redirect("/listing")
    }
    res.render("listings/show.ejs", { listing })

}));

// create Route 
router.post("/",validateListing, wrapAsync(async (req, res, next) => {
    //    let {title, description, image, price, location , country} = req.body;
    // let listing = req.body.listing;
    // console.log(listing); 
   
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");

})
);



router.get("/:id/edit",wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))



// update Route

router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400 , "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Listing Updated !");

    res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted !");
    res.redirect("/listings");
}))

module.exports = router;