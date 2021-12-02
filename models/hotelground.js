const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
            url: String,
            filename: String

});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const HotelgroundSchema = new Schema({
    title : String,
    image : [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price : Number,
    description: String,
    location : String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
