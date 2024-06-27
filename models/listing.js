const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required : true,
    },
    description : String,
    image: {
        type: String,
        default : "https://unsplash.com/photos/black-suv-on-road-in-between-trees-during-daytime-sAHEPmZVL5U",
        set : (v) => v===""?"https://unsplash.com/photos/black-suv-on-road-in-between-trees-during-daytime-sAHEPmZVL5U" : v,

    },
    price : Number,
    location : String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;