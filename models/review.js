const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Sehema({
    body: String,
    rating: Number 
});

module.exports = mongoose.model("Review", reviewSchema);
