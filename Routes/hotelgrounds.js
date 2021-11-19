const express = require('express');
const router = express.Router();
const hotelgrounds = require('../controllers/hotelgrounds')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateHotelground, isAuthor} = require('../middleware')

const Hotelground = require('../models/hotelground');



router.get('/', catchAsync(hotelgrounds.index));

router.get('/new', isLoggedIn, hotelgrounds.randerNewForm)

router.post('/', validateHotelground, catchAsync(hotelgrounds.createHotelground))


router.get('/:id', catchAsync(hotelgrounds.showHotelground))

router.get('/:id/edit', isLoggedIn ,isAuthor, catchAsync(hotelgrounds.randerEditForm ))


router.put('/:id',isLoggedIn, isAuthor, validateHotelground, catchAsync(hotelgrounds.updateHotelground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(hotelgrounds.deleteHotelground))

module.exports = router;