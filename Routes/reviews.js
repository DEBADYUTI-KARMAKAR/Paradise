const express = require('express');
const router = express.Router();

const {reviewSchema } = require('./schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Hotelground = require('./models/hotelground');
const Review = require('./models/review');

const validateReview =(req, res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }

}


router.post('/', validateReview ,catchAsync(async (req, res) => {
    const hotelground = await Hotelground.findById(req.params.id);
    const review = new Review(req.body.review);
    hotelground.reviews.push(review);
    await review.save();
    await hotelground.save();
    res.redirect(`/hotelgrounds/${hotelground._id}`);
}))

router.delete('/:reviewId' , catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
    await Hotelground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}}); // $pull => remove from mongo
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hotelgrounds/${id}`)
}))

module.exports = router;