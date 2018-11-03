var Campground = require("../models/campground"),
    Comment    = require("../models/comment");
// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  // is user logged in?
    if(req.isAuthenticated()){
      Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
          req.flash("error", "Campground not found");
          res.redirect("back");
        }
        else{
          if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
            next();
          } else{
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      // does user own the campground
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  // is user logged in?
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect("back");
        }
        else{
          // does user own the comments
          if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            next();
          } else{
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      // does user own the campground
      req.flash("error", "You need to be logged in to do that");
      res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    req.flash("error", "You need to be login to do that.");
    res.redirect("/login");
  }
}

module.exports = middlewareObj;
