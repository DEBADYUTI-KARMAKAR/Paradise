const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { hotelgroundSchema } = require('../schemas.js');
const {isLoggedIn} = require('../middleware')
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

router.get('/new', isLoggedIn,(req, res) =>{
    
    res.render('hotelgrounds/new');
})

router.post('/', validateHotelground, catchAsync(async (req, res, next) =>{
    
   // if(!req.body.hotelground) throw new ExpressError('Invalid Hotelground Data', '400')

   
   const hotelground =new Hotelground(req.body.hotelground);
   await hotelground.save();
   req.flash('success','Successfully made a new campground')
    res.redirect(`/hotelgrounds/${hotelground._id}`)
   
}))


router.get('/:id', catchAsync(async(req, res,) =>{
    const hotelground = await Hotelground.findById(req.params.id).populate('reviews');
  
    if(!hotelground){
        req.flash('error','Cannot Find');
        return res.redirect('/hotelgrounds');
    }
    res.render('hotelgrounds/show', { hotelground });
}))

router.get('/:id/edit',isLoggedIn, catchAsync(async(req, res) =>{
    
    const hotelground = await Hotelground.findById(req.params.id);
    if(!hotelground){
        req.flash('error','Cannot Find');
        return res.redirect('/hotelgrounds');
    }
    res.render('hotelgrounds/edit', { hotelground });
}))


router.put('/:id',isLoggedIn, validateHotelground, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const hotelground = await Hotelground.findByIdAndUpdate(id, {...req.body.hotelground });
    req.flash('success','Successfully Updated Hotelground')
    res.redirect(`/hotelgrounds/${hotelground._id}`)
}));

router.delete('/:id', isLoggedIn,catchAsync(async(req,res) =>{
    const { id } = req.params;
    await Hotelground.findByIdAndDelete(id);
    req.flash('success', "Hotelground Deleted ")
    res.redirect('/hotelgrounds');
}))

module.exports = router;