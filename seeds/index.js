
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

    for(let i = 0;i<10;i++){
        
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10 ;
        const hotel = new Hotelground({
            author: '618bd35fcd02a11ac8bc4111',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description : 'Deals from your favourite booking sites. All in one place.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            image:  [
                {
                 
                  url: 'https://res.cloudinary.com/dwc6z7wkm/image/upload/v1638989059/Paradise/20-SM343221_rhmaxv.jpg',
                  filename: 'Paradise/20-SM343221_rhmaxv'
                },
                {
                  
                  url: 'https://res.cloudinary.com/dwc6z7wkm/image/upload/v1638989059/Paradise/20-SM343221_rhmaxv.jpg',
                  filename: 'Paradise/20-SM343221_rhmaxv'
                }
              ]
        })

        await hotel.save();
    }

}
seedDB().then(() =>{
    mongoose.connection.close()
})