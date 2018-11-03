var mongoose    = require("mongoose"),
    Campground  = require("./models/campground");
    Comment     = require("./models/comment");
var data = [
  {
    name: "Monkey King's Place",
    image:"https://farm9.staticflickr.com/8086/8500579154_5350408dc9.jpg",
    description: "Bacon ipsum dolor amet salami ground round picanha shank ham ribeye. Beef picanha andouille leberkas corned beef turkey drumstick. Tongue ball tip kevin andouille tail beef ribs boudin spare ribs chuck flank. Beef ribs turkey beef, leberkas flank sirloin filet mignon. Meatball kielbasa ham hock jerky, bacon beef ribs landjaeger ground round prosciutto short loin ribeye shank andouille sausage."
},
  {
    name: "Snowy Isle",
    image: "https://farm5.staticflickr.com/4125/5062575465_701ae140e4.jpg",
    description: "Bacon ipsum dolor amet salami ground round picanha shank ham ribeye. Beef picanha andouille leberkas corned beef turkey drumstick. Tongue ball tip kevin andouille tail beef ribs boudin spare ribs chuck flank. Beef ribs turkey beef, leberkas flank sirloin filet mignon. Meatball kielbasa ham hock jerky, bacon beef ribs landjaeger ground round prosciutto short loin ribeye shank andouille sausage."
},
  {
    name: "Kirbyy's Sweety Mountain",
    image: "https://farm3.staticflickr.com/2950/15232292419_e3b1846217.jpg",
    description: "Bacon ipsum dolor amet salami ground round picanha shank ham ribeye. Beef picanha andouille leberkas corned beef turkey drumstick. Tongue ball tip kevin andouille tail beef ribs boudin spare ribs chuck flank. Beef ribs turkey beef, leberkas flank sirloin filet mignon. Meatball kielbasa ham hock jerky, bacon beef ribs landjaeger ground round prosciutto short loin ribeye shank andouille sausage."
  }
];

function seedDB(){
Campground.remove({}, function(err){
  if(err){
    console.log(err);
  }
  console.log("removed campgrounds!");
  // add a few campgrounds
  data.forEach(function(seed){
  Campground.create(seed, function(err, campground){
    if(err){
      console.log(err);
    }
    else{
      console.log("ADDED A CAMPGROUND!");
      // add a few comments
      Comment.create(
        {
          text: "This place is great, but I wish there was internet",
          author: "Homer"
        }, function(err, comment){
          if(err){
            console.log(err);
          }
            campground.comments.push(comment);
            campground.save();
            console.log("Created new comment");
        }
    );
    }
  });
});
});

}

module.exports = seedDB;
