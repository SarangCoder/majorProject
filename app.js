const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path  = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
//ejs-mate help to create the layout of webpage(navbar)

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=> {
    console.log("Connected to DB");
}).catch((err) =>{console.log(err);});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views" ,path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));

app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);

// to use public folder static style 
app.use(express.static(path.join(__dirname, "/public" )));

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

//Index Route
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , { allListings});
});

//New Route
app.get("/listings/new" ,(req,res) => {
    res.render("listings/new.ejs");
 })

// Show Route 
app.get("/listings/:id" , async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing})

});

// create Route 
app.post("/listings" , async (req,res) => {
//    let {title, description, image, price, location , country} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
   const newListing =  new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

app.get("/listings/:id/edit" , async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing} )
})

// update Route

app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id" , async (req,res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
})

app.get("/" , (req,res) => { 
    res.send("Hi, I am root");
});
app.listen(8080, ()=> {
    console.log("Server is listening to port: 8080");
})