const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn , isReviewAuthor} = require('../middleware');
const Hotelground = require('../models/hotelground');
const Review = require('../models/review');

const {reviewSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');




router.post('/', isLoggedIn, validateReview ,catchAsync(async (req, res) => {
    const hotelground = await Hotelground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hotelground.reviews.push(review);
    await review.save();
    await hotelground.save();
    req.flash('success', "Review Added")
    res.redirect(`/hotelgrounds/${hotelground._id}`);
}))

router.delete('/:reviewId' ,isLoggedIn, isReviewAuthor, catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
    await Hotelground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}}); // $pull => remove from mongo
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review Deleted")
    res.redirect(`/hotelgrounds/${id}`)
}))

module.exports = router;