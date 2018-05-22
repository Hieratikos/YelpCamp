var express = require("express");
//"mergeParams:true" must be set since the routing path uses "/:id" as a parameter in the mongoose paths
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//we do not need to specify "index.js" as that is the default lookup file for node.js
var middleware = require("../middleware");

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campgroundObj){
        if (err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campgroundObj});
        }
    });
});
//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup Campground using ID
    Campground.findById(req.params.id, function(err, campgroundObj){
        if (err){
            console.log("POSTING ERROR! : " + err);
        }else{
            //create new comment
            Comment.create(req.body.comment, function(err, commentObj){
                if (err){
                    console.log("SUB POSTING ERROR: " + err);
                }else{
                    //add id and username to comment
                    commentObj.author.id = req.user._id;
                    commentObj.author.username = req.user.username;
                    //save comment
                    commentObj.save();
                    //connect new comment to campground
                    campgroundObj.comments.push(commentObj);
                    campgroundObj.save();
                    req.flash("success", "Successfully added comment");
                    //redirect to campground show page
                    res.redirect("/campgrounds/" + campgroundObj._id);
                }
            });
        }
    });
});
//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campgroundObj){
       if (err || !campgroundObj) {
           req.flash("error", "Campground not found");
           return res.redirect("back");
       }
        Comment.findById(req.params.comment_id, function(err, commentsObj){
            if (err){
                console.log(err);
            }else{
                res.render("comments/edit", {campground_id: req.params.id, comment:commentsObj});
            }
        });
    });
});
//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, commentsObj){
        if (err){
            console.log(err);
        }else{
            //redirect to the "show" page, which is the parent campground page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // res.send("delete route");
    Comment.findByIdAndRemove(req.params.comment_id, function(err, commentsObj){
        if (err){
            console.log(err);
        }else{
            req.flash("success", "Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;