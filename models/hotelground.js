const mongoose = require('mongoose');
const Review = require('./review')
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

HotelgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        }) 
    }
})

module.exports = mongoose.model('Hotelground', HotelgroundSchema);
