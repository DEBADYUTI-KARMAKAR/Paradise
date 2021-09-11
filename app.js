const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
//const flash = require('connect-flash');



const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Hotelground = require('./models/hotelground');
const Review = require('./models/review');

const hotelgrounds = require('./routes/hotelgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/paradise',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology : true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig ={
    secret : 'this is secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 *60 *24 *7,
        maxAge :1000 * 60 *60 *24 *7
    }
}

app.use(session(sessionConfig))
//app.use(flash());


app.use((req,res,next) =>{
    res.locals.success =  req.flash('success');
    res.locals.error = req.flash('error');    
    next();
})

app.use('/hotelgrounds', hotelgrounds)

app.use('/hotelgrounds/:id/reviews', reviews)

app.get('/', (req, res) =>{
    //res.send("Hello from debadyuti");
    res.render('home')
})

/*app.get('/makehotelground', async(req, res) =>{
    const hotel = new Hotelground({title:'Great tour',price:'1000 per day',description:'Super place',location:'Paling'})
    await hotel.save();
    res.send(hotel);
})*/





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