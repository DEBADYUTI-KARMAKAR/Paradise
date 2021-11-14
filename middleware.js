const { hotelgroundSchema, reviewSchema } = require('./schemas.js');

const ExpressError = require('./utils/ExpressError');
const Hotelground = require('./models/hotelground')
module.exports.isLoggedIn = (req,res, next) =>{
if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl
    req.flash('error',"You must be Logedin first");
    return res.redirect('/login');
}
next();
}

module.exports.validateHotelground = (req,res,next) => {
    
    const {error} = hotelgroundSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next) =>{
    const { id } = req.params;
    const hotelground = await Hotelground.findById(id);
    if(!hotelground.author.equals(req.user._id)){
        req.flash('error','Not Permitted');
        res.redirect(`/hotelgrounds/${id}`)
    }
    next();
}


module.exports.validateReview =(req, res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }

}