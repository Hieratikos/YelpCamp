var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
        //is user logged in?
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campgroundObj){
            if (err || !campgroundObj){
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }else{
                //does user own the campground?--the equals() method lets mongoose verify the equality of the values since the campgroundObj in this case is a mongoose object
                if (campgroundObj.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is user logged in?
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, commentObj){
            if (err || !commentObj){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                //does user own the comment?--the equals() method lets mongoose verify the equality of the values since the commentObj in this case is a mongoose object
                if (commentObj.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You do not have permission to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    //the req.isAuthenticated() is equivalent to: <req.session.passport.user !== undefined>
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}

module.exports = middlewareObj;