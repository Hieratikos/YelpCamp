var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//we do not need to specify "index.js" as that is the default lookup file for node.js
var middleware = require("../middleware");

//INDEX ROUTE: show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB in GET
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, page:"campgrounds"});
        }
    });
});
//CREATE ROUTE: add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newAuthor = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description:desc, author:newAuthor};
    //Create a new campground and save to DB in POST
    Campground.create(newCampground, function(err, newObj){
        if (err){
        console.log(err);
    }else{
        //redirect back to campgrounds page
        res.redirect("campgrounds");
        }
    });
});
//NEW ROUTE: show form to add new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});
//SHOW ROUTE (always remember to place this route below the /new route so the /new route gets processed by its handler)
router.get("/:id", function(req, res){
    //find the campground with provided id; remember the id in findById(req.params.id) below comes from the path app.get("/campgrounds/:id")
    //populate the specific campground with the comments data
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundObj){
        if (err || !foundObj){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            //render the template with that campground
            res.render("campgrounds/show", {campground:foundObj});
        }
    });
});
//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campgroundObj){
        res.render("campgrounds/edit", {campground:campgroundObj});
    });
});
//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campgroundObj){
        if (err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})
//DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campgroundObj){
        if (err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;