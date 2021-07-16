
const path = require('path');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const mongoose = require('mongoose');
const Hotelground = require('../models/hotelground');
const { captureRejectionSymbol } = require('events');

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


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Hotelground.deleteMany({});
    /*const c = new Hotelground({title:'purplr field'});
    await c.save();*/

    for(let i = 0;i<50;i++){
        
        const random1000 = Math.floor(Math.random() * 1000);
        const hotel = new Hotelground({
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })

        await hotel.save();
    }

}
seedDB().then(() =>{
    mongoose.connection.close()
})