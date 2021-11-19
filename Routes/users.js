const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users')
 
router.get('/register', users.renderRegister);

router.post('/register', catchAsync ( users.register))

router.get('/login',(req,res) =>{
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', {failureFlash:true,failureRedirect:'/login'})  ,(req,res) =>{
    req.flash('success','Welcome')
    const redirectUrl = req.session.returnTo || '/hotelgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success', "Bye!!");
    res.redirect('/hotelgrounds');
})

module.exports = router;