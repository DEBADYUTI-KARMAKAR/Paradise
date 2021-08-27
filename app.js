const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { HotelgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Hotelground = require('./models/hotelground');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/paradise',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console ,"connection error:"));
db.once("open", () =>{
    console.log("Database Connected");
} )

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


const validateHotelground = (req,res,next) => {
    
    const {error} = hotelgroundSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

const validateReview =(req, res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }

}

app.get('/', (req, res) =>{
    //res.send("Hello from debadyuti");
    res.render('home')
})

/*app.get('/makehotelground', async(req, res) =>{
    const hotel = new Hotelground({title:'Great tour',price:'1000 per day',description:'Super place',location:'Paling'})
    await hotel.save();
    res.send(hotel);
})*/

app.get('/hotelgrounds', catchAsync( async(req, res) =>{
    //res.send("Hello from debadyuti");
    const hotelgrounds = await Hotelground.find({});
    res.render('hotelgrounds/index',  {hotelgrounds});
}))

app.get('/hotelgrounds/new', (req, res) =>{
    
    res.render('hotelgrounds/new');
})

app.post('/hotelgrounds', validateHotelground, catchAsync(async (req, res, next) =>{
    
   // if(!req.body.hotelground) throw new ExpressError('Invalid Hotelground Data', '400')

    
    
    const hotelground =new Hotelground(req.body.hotelground);
    await hotelground.save();
    res.redirect(`/hotelgrounds/${hotelground._id}`)
   
}))


app.get('/hotelgrounds/:id', catchAsync(async(req, res) =>{
    const hotelground = await Hotelground.findById(req.params.id).populate('reviews');
    console.log(hotelground);
    res.render('hotelgrounds/show', { hotelground });
}))

app.get('/hotelgrounds/:id/edit', catchAsync(async(req, res) =>{
    
    const hotelground = await Hotelground.findById(req.params.id);
    res.render('hotelgrounds/edit', { hotelground });
}))


app.put('/hotelgrounds/:id', validateHotelground, catchAsync(async(req, res) =>{
    const { id } = req.params;
    const hotelground = await Hotelground.findByIdAndUpdate(id, {...req.body.hotelground });
    res.redirect(`/hotelgrounds/${hotelground._id}`)
}));

app.delete('/hotelgrounds/:id', catchAsync(async(req,res) =>{
    const { id } = req.params;
    await Hotelground.findByIdAndDelete(id);
    res.redirect('/hotelgrounds');
} ))

app.post('/hotelgrounds/:id/reviews', validateReview ,catchAsync(async (req, res) => {
    const hotelground = await Hotelground.findById(req.params.id);
    const review = new Review(req.body.review);
    hotelground.reviews.push(review);
    await review.save();
    await hotelground.save();
    res.redirect(`/hotelgrounds/${hotelground._id}`);
}))

app.delete('/hotelgrounds/:id/reviews/:reviewId' , catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
    await Hotelground.findByIdAndUpdate(id, { $pull: {reviews: reviewId}}); // $pull => remove from mongo
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hotelgrounds/${id}`)
}))

app.all('*', (req,res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong'  ;
    res.status(statusCode).render('error',{err})
    //res.send("Opss!!Something went wrong");
})

app.listen(3000, () =>{
    console.log("Hosting 3000");
})