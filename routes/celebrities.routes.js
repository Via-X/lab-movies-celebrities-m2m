// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

// all your routes here
function guardRoute(req, res){
  if(!req.session.currentUser){
    //Check if already redirected
    if(!res.headerSent){
      res.redirect("/login");
    }
    return;
  };
}

//CREATE
//Route GET to Add New Celebrity
router.get("/create", (req, res, next) => {
  guardRoute(req, res, next);
  res.render("celebrities/new-celebrity");
});

//Route POST to Add New Celebrity
router.post("/create", (req, res, next) => {
  guardRoute(req, res, next);
  Celebrity.create({
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
  })
    .then((result) => {
      req.flash("successMessage", "Celebrity successfully added");
      res.redirect("/celebrities");
    })
    .catch((err) => {
      req.flash("errorMessage", "Sorry something went wrong");
      res.redirect("/create");
    });
});


//READ
//Route to display all Celebrities
router.get("/", (req, res, next) => {
  guardRoute(req, res, next);
  Celebrity.find().populate("movie")
    .then((allCelebrities) => {
      console.log("HERE:",allCelebrities);
      res.render("celebrities/celebrities", { celebrities: allCelebrities });
    })
    .catch((err) => {
      next(err);
    });
});


//Route to display Celebrity details
router.get("/:theId", (req, res, next) => {
  guardRoute(req, res, next);
  Celebrity.findById(req.params.theId).populate("movie")
    .then((dbCeleb) => {
      console.log("Movie Pop: "+ dbCeleb);
      res.render("celebrities/celebrity-details", dbCeleb);
    })
    .catch((err) => {
      next(err);
    });
});

//UPDATE
//Route GET to edit a Celebrity


//Route POST to edit a Celebrity







//DELETE
//Route to delete a Celebrity
router.post("/:theId/delete", (req, res, next) => {
  guardRoute(req, res, next);
  Movie.find()
  .then((dbMovie) => {
    dbMovie.forEach(theMovie => {
      theMovie.cast.forEach((celeb, index) => {
        if(celeb._id.equals(req.params.theId)){
          theMovie.cast.splice(index, 1);
        }
      })
    })
  })
  Celebrity.findByIdAndDelete(req.params.theId)
  .then((dbCelebrity) => {
    res.redirect("/celebrities");
  })
  .catch((err) => {
    next(err);
  })
})



module.exports = router;