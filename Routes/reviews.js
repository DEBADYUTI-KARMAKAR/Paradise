const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn , isReviewAuthor} = require('../middleware');
const Hotelground = require('../models/hotelground');
const Review = require('../models/review');
const reviews = require('../controllers/review')
const {reviewSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const hotelground = require('../models/hotelground');




router.post('/', isLoggedIn, validateReview ,catchAsync(reviews.createReview))

router.delete('/:reviewId' ,isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;