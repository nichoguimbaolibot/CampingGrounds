var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
// requiring routes
var commentRoutes    = require("./routes/comments");
var  campgroundRoutes = require("./routes/campgrounds");
var indexRoutes      = require("./routes/index");

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.connect("mongodb://nicho:nicho@ds149134.mlab.com:49134/yelpcampkirbyy", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seed the database
// seedDB();

// MOMENTJS
app.locals.moment = require("moment");
// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret : "Once again Kim is the cutest!",
  resave : false,
  saveUninitialized : false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// EVERYTHING INSIDE IN HERE CAN BE ACCESS GLOBALLY
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);
// process.env.PORT, process.env.IP
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Yelp Camp Server has started.");
});
