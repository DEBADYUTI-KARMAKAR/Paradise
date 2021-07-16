const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Hotelground = require('./models/hotelground');

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

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))


app.get('/', (req, res) =>{
    //res.send("Hello from debadyuti");
    res.render('home')
})

/*app.get('/makehotelground', async(req, res) =>{
    const hotel = new Hotelground({title:'Great tour',price:'1000 per day',description:'Super place',location:'Paling'})
    await hotel.save();
    res.send(hotel);
})*/

app.get('/hotelgrounds', async(req, res) =>{
    //res.send("Hello from debadyuti");
    const hotelgrounds = await Hotelground.find({});
    res.render('hotelgrounds/index',  {hotelgrounds});
})

app.get('/hotelgrounds/new', (req, res) =>{
    
    res.render('hotelgrounds/new');
})

app.post('/hotelgrounds', async(req, res) =>{
    
    const hotelground =new Hotelground(req.body.hotelground);
    await hotelground.save();
    res.redirect(`/hotelgrounds/${hotelground._id}`)
})


app.get('/hotelgrounds/:id', async(req, res) =>{
    const hotelground = await Hotelground.findById(req.params.id);
    res.render('hotelgrounds/show', { hotelground });
})


app.listen(3000, () =>{
    console.log("Hosting 3000");
})