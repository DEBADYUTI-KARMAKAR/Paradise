const User = require('../models/user');

module.exports.renderRegister = (req, res)=>{

    res.render('users/register');

}

module.exports.register = async(req, res)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email,username})
    const registeredUser =  await User.register(user, password);
    req.login(registeredUser, err =>{
        if(err) return next(err);
        req.flash('Success','Welcome to Paradise!!')
        res.redirect('/hotelgrounds')
    })
    } catch(e)
    {
        req.flash('error',e.message)
        res.redirect('register')
    }
}

module.exports.renderLogin = (req,res) =>{
    res.render('users/login');
}

module.exports.login = (req,res) =>{
    req.flash('success','Welcome')
    const redirectUrl = req.session.returnTo || '/hotelgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}