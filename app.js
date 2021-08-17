const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const methodOverride = require('method-override'); 
const Hotelground = require('./models/hotelground');
const { findByIdAndUpdate } = require('./models/hotelground');

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

app.post('/hotelgrounds', catchAsync(async (req, res, next) =>{
    
    const hotelground =new Hotelground(req.body.hotelground);
    await hotelground.save();
    res.redirect(`/hotelgrounds/${hotelground._id}`)
   
}))


app.get('/hotelgrounds/:id', catchAsync(async(req, res) =>{
    const hotelground = await Hotelground.findById(req.params.id);
    res.render('hotelgrounds/show', { hotelground });
}))
app.get('/hotelgrounds/:id/edit', catchAsync(async(req, res) =>{
    
    const hotelground = await Hotelground.findById(req.params.id);
    res.render('hotelgrounds/edit', { hotelground });
}))


app.put('/hotelgrounds/:id', catchAsync(async(req, res) =>{
    const { id } = req.params;
    const hotelground = await Hotelground.findByIdAndUpdate(id, {...req.body.hotelground });
    res.redirect(`/hotelgrounds/${hotelground._id}`)
}));

app.delete('/hotelgrounds/:id', catchAsync(async(req,res) =>{
    const { id } = req.params;
    await Hotelground.findByIdAndDelete(id);
    res.redirect('/hotelgrounds');
} ))

app.all('*',(req,res,next) =>{
    res.send("404!!");
})


app.use((err,req,res,next) => {
    res.send("Something went wrong");
})

app.listen(3000, () =>{
    console.log("Hosting 3000");
})