const Hotelground = require('../models/hotelground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const hotelground = await Hotelground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hotelground.reviews.push(review);
    await review.save();
    await hotelground.save();
    req.flash('success', "Review Added")
    res.redirect(`/hotelgrounds/${hotelground._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Hotelground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}}); // $pull => remove from mongo
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review Deleted")
    res.redirect(`/hotelgrounds/${id}`)
}