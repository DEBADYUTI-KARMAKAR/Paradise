const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');

 
router.get('/register', (req, res)=>{

    res.render('users/register');

})

router.post('/register', catchAsync ( async(req, res)=>{
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
}))

router.get('/login',(req,res) =>{
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', {failureFlash:true,failureRedirect:'/login'})  ,(req,res) =>{
    req.flash('success','Welcome')
    res.redirect('/hotelgrounds')
})

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success', "Bye!!");
    res.redirect('/hotelgrounds');
})

module.exports = router;