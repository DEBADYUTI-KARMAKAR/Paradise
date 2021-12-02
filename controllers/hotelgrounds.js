const Hotelground = require('../models/hotelground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary");

module.exports.index =async(req, res) =>{
    //res.send("Hello from debadyuti");
    const hotelgrounds = await Hotelground.find({});
    res.render('hotelgrounds/index',  {hotelgrounds});

}

module.exports.randerNewForm = (req, res) =>{
    
    res.render('hotelgrounds/new');
}

module.exports.createHotelground = async (req, res, next) =>{
    
    // if(!req.body.hotelground) throw new ExpressError('Invalid Hotelground Data', '400')
    const geoData = await geocoder.forwardGeocode({
        query: req.body.hotelground.location,
        limit: 1
    }).send()
    
    const hotelground =new Hotelground(req.body.hotelground);
    hotelground.geometry = geoData.body.features[0].geometry;
    hotelground.image= req.files.map(f => ({url: f.path, filename: f.filename}))
    hotelground.author =  req.user._id;
    await hotelground.save();
    console.log(hotelground);
    req.flash('success','Successfully made a new campground')
     res.redirect(`/hotelgrounds/${hotelground._id}`)
    
 }

 module.exports.showHotelground = async(req, res,) =>{
    const hotelground = await Hotelground.findById(req.params.id).populate({
        path:'reviews',
        populate : {
            path: 'author'
        }
    }).populate('author');
    
    if(!hotelground){
        req.flash('error','Cannot Find');
        return res.redirect('/hotelgrounds');
    }
    res.render('hotelgrounds/show', { hotelground });
}

module.exports.randerEditForm = async(req, res) =>{
    const { id } = req.params;
    const hotelground = await Hotelground.findById(id);
    
    if(!hotelground){
        req.flash('error','Cannot Find');
        return res.redirect('/hotelgrounds');
    }
   
    res.render('hotelgrounds/edit', { hotelground });
}

module.exports.updateHotelground = async(req, res) =>{
    const { id } = req.params;
   console.log(req.body);
    const hotelground = await Hotelground.findByIdAndUpdate(id, {...req.body.hotelground });
    const imgs =req.files.map(f => ({url: f.path, filename: f.filename}))
    hotelground.image.push(...imgs);

    await hotelground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await hotelground.updateOne({ $pull:{ image: { filename: { $in: req.body.deleteImages}}}})
        console.log(hotelground);
    }
    req.flash('success','Successfully Updated Hotelground')
    res.redirect(`/hotelgrounds/${hotelground._id}`)
}

module.exports.deleteHotelground = async(req,res) =>{
    const { id } = req.params;
    await Hotelground.findByIdAndDelete(id);
    req.flash('success', "Hotelground Deleted ")
    res.redirect('/hotelgrounds');
}
