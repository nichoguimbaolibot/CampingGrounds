
var express = require("express"),
    router  = express.Router(),
    User   = require("../models/user"),
    Campground = require("../models/campground"),
    middleware = require("../middleware/index.js"),
    geocoder   = require("geocoder");

// INDEX - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    var noMatch;
    Campground.find({name: regex}, function(err, allCampgrounds){
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      }
      else{
        if(allCampgrounds.length < 1){
           noMatch = "No campgrounds match that query, please try again.";
        }
        res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser : req.user, noMatch: noMatch});
      }
    });
  } else{
  // information of login user
  // req.user
// Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    }
    else{
      res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser : req.user, noMatch: noMatch});
    }
  });
}
});
// CREATE - ADD NEW CAMPGROUND TO DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get the data from the campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
   var lat = data.results[0].geometry.location.lat;
   var lng = data.results[0].geometry.location.lng;
   var location = data.results[0].formatted_address;
  var newCampground = {name : name, price : price, image : image, description : description , author : author, location : location, lat : lat, lng : lng};
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    }
    else{
      // redirect back to campgrounds page
      req.flash("success", "Successfully created a campground!")
      console.log(newlyCreated);
      res.redirect("/campgrounds");
    }
  });
});

});
// NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});
// SHOW - SHOWS MORE INFO ABOUT ONE CAMPGROUND
router.get("/:id", function(req,res){
  // find the campground with the provided id
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    }
    else{
      console.log(foundCampground);
      // render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });

});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
      Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground : foundCampground});
      });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});
// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//   // find and update the correct campground
//   geocoder.geocode(req.body.location, function(err, data){
//
//   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//     if(err){
//       req.flash("error", err.message);
//       res.redirect("/campgrounds");
//     }
//     else{
//       req.flash("success", "Successfully Updated!")
//       res.redirect("/campgrounds/" + req.params.id);
//     }
//     });
//   });
// });
// DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err, data){
    if(err){
      res.redirect("/campgrounds");
    }
    else{
      res.redirect("/campgrounds");
    }
  });
});

function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}



module.exports = router;
