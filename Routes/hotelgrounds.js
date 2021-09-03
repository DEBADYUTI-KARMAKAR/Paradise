const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { hotelgroundSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Hotelground = require('../models/hotelground');

const validateHotelground = (req,res,next) => {
    
    const {error} = hotelgroundSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

router.get('/', catchAsync( async(req, res) =>{
    //res.send("Hello from debadyuti");
    const hotelgrounds = await Hotelground.find({});
    res.render('hotelgrounds/index',  {hotelgrounds});
}))

router.get('/new', (req, res) =>{
    
    res.render('hotelgrounds/new');
})

router.post('/', validateHotelground, catchAsync(async (req, res, next) =>{
    
   // if(!req.body.hotelground) throw new ExpressError('Invalid Hotelground Data', '400')

    
    
    const hotelground =new Hotelground(req.body.hotelground);
    await hotelground.save();
    res.redirect(`/hotelgrounds/${hotelground._id}`)
   
}))


router.get('/:id', catchAsync(async(req, res) =>{
    const hotelground = await Hotelground.findById(req.params.id).populate('reviews');
    console.log(hotelground);
    res.render('hotelgrounds/show', { hotelground });
}))

router.get('/:id/edit', catchAsync(async(req, res) =>{
    
    const hotelground = await Hotelground.findById(req.params.id);
    res.render('hotelgrounds/edit', { hotelground });
}))


router.put('/:id', validateHotelground, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const hotelground = await Hotelground.findByIdAndUpdate(id, {...req.body.hotelground });
    res.redirect(`/hotelgrounds/${hotelground._id}`)
}));

router.delete('/:id', catchAsync(async(req,res) =>{
    const { id } = req.params;
    await Hotelground.findByIdAndDelete(id);
    res.redirect('/hotelgrounds');
}))

module.exports = router;