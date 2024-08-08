const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// for error wrapAsync function 

//Routing
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");


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

const sessionOptions = {
    secret : "mysupersercretcode",
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        
    },
}

app.use(session(sessionOptions));
app.use(flash());

//using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => { 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();
});

//demo user
// app.get("/demouser" , async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "Delta-student",
//     });
//    let registerdUser = await User.register(fakeUser, "helloworld");
//    res.send(registerdUser);
// })


app.use("/listings", listings);
app.use("/listings/:id/reviews" , reviews);
app.use("/" , userRouter);
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