const express = require('express');
const router = express.Router();
const hotelgrounds = require('../controllers/hotelgrounds')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateHotelground, isAuthor} = require('../middleware')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Hotelground = require('../models/hotelground');


router.route('/')
    .get(catchAsync(hotelgrounds.index))
    .post(isLoggedIn,  upload.array('image'),validateHotelground, catchAsync(hotelgrounds.createHotelground))
    /*.post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send("IT Works!!")
    })*/
    
router.get('/new', isLoggedIn, hotelgrounds.randerNewForm)
router.route('/:id')
    .get(catchAsync(hotelgrounds.showHotelground))
    .put(isLoggedIn, isAuthor, validateHotelground, catchAsync(hotelgrounds.updateHotelground))
    .delete(isLoggedIn, isAuthor, catchAsync(hotelgrounds.deleteHotelground))
    

router.get('/:id/edit', isLoggedIn ,isAuthor, catchAsync(hotelgrounds.randerEditForm ))








module.exports = router;