const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users')
 
router.get('/register', users.renderRegister);

router.post('/register', catchAsync ( users.register))

router.get('/login', users.renderLogin);
router.post('/login', passport.authenticate('local', {failureFlash:true,failureRedirect:'/login'})  ,users.login)

router.get('/logout', users.logout);

module.exports = router;