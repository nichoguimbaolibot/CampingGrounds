var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    LocalStrategy= require("passport-local").Strategy,
    middleware = require("../middleware"),
    User   = require("../models/user");
// root route
router.get("/", function(req, res){
  res.render("landing");
});



// ===========
// AUTH ROUTES
// ===========

// show register form
router.get("/register", function(req, res){
  res.render("register");
});

// handle signup logic
router.post("/register", function(req, res){
  var newUser = new User({
                          username : req.body.username,
                          firstName : req.body.firstName,
                          lastName: req.body.lastName,
                          email: req.body.email,
                          avatar: req.body.avatar
                        });
  if(req.body.adminCode === "secretcode123"){
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req, res, function(){
        req.flash("success", "Welcome to Kilein's Camp Site " + user.username);
        res.redirect("/campgrounds");
      });
    }
  });
});

// show login form
router.get("/login", function(req, res){
  res.render("login");
});
// router.post("/login", middleware, callback)
// ORIGINAL
router.post("/login",passport.authenticate("local",
  {
    successRedirect : "/campgrounds",
    successFlash    : "Welcome To Kilein's Camp Site",
    failureRedirect : "/login",
    failureFlash    : "Invalid username or password"
  }), function(req, res){
});
// var count = 0;
// router.post("/login", function(req, res){
//   passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));
// });

// logout routes
router.get("/logout", function(req,res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

// USERS PROFILES
router.get("/users/:id", middleware.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error", err.message);
      res.redirect("/");
    } else{
      res.render("users/show", {user : foundUser});
    }
  });
});

module.exports = router;
