const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
// for error wrapAsync function 
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
//ejs-mate help to create the layout of webpage(navbar)
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => { console.log(err); });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// to use public folder static style 
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/testListing" , async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });

const validateListing = (req,res,next)  => {
    let error = listingSchema.validate(req.body);
    
    if(error){
        // let errMgs = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
}

// for validate review schema 
const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

// Show Route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing })

}));

// create Route 
app.post("/listings",validateListing, wrapAsync(async (req, res, next) => {
    //    let {title, description, image, price, location , country} = req.body;
    // let listing = req.body.listing;
    // console.log(listing); 
   
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

})
);

app.get("/listings/:id/edit",wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))



// update Route

app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400 , "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

// Reviews
//Post Route
app.post("/listings/:id/reviews",validateReview , wrapAsync( async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

}));

// delete review route 
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"))
// })

app.use((err, req, res, next) => {
    let { statusCode =500, message="Some thing went Wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {err}); 
    console.log(err);
});
app.listen(8080, () => {
    console.log("Server is listening to port: 8080");
})