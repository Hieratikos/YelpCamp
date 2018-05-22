var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");
    // seedDB      = require("./seeds");

//REQUIRING ROUTES
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the DB

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Charlie still owns me.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//the User.authenticate(), User.serializeUser(), & User.deserializeUser() methods come from <passport-local-mongoose>
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is an automatic middleware function that passes req.user as a variable called "currentUser" to every page
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//CONNECT MONGOOSE TO DB
// mongoose.connect(process.env.DATABASEURL);
mongoose.connect(process.env.LOCALDB);

//USE ALL ROUTES
//the "/campgrounds/:id/comments" parameter prepends that string to every router.get() or .post() path in the comments.js file
//var router = express.Router({mergeParams:true}); must be set in the comments.js file for the "/:id" parameter to be linked from this route path
app.use("/campgrounds/:id/comments", commentRoutes);
//the "/campgrounds" parameter prepends that string to every router.get() or .post() path in the campgrounds.js file
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

app.listen(3000, function(){
    console.log("yelp server started.");
});
/*
"name" : "Bear Mountain", "image" : "https://cdn.pixabay.com/photo/2017/08/02/00/08/camping-2568900_960_720.jpg"
"name" : "Salmon Creek", "image" : "https://www.nps.gov/drto/planyourvisit/images/960pxCampsites.jpg"
"name" : "Weed Gulch", "image" : "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg"
"name" : "Utah Bluffs", "image" : "https://www.goodfreephotos.com/albums/united-states/utah/zion-national-park/camping-in-zion-national-park-utah.jpg"
*/