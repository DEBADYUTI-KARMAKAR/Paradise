module.exports.isLoggedIn = (req,res, next) =>{
if(!req.isAuthenticated()){
    req.flash('error',"You must be Logedin first");
    return res.redirect('/login');
}
next();
}