const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelgroundSchema = new Schema({
    title : String,
    image : String,
    price : Number,
    description: String,
    location : String,
    reviews : [
        {
        type : Schema.Types.ObjectId,
        ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Hotelground', HotelgroundSchema);
