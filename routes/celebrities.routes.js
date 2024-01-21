// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");
const guardRoute = require("../utils/guardroute");
const uploadRoute = require("../config/cloud");


// all your routes here

//CREATE
//Route GET to Add New Celebrity
router.get("/create", guardRoute, (req, res, next) => {
  res.render("celebrities/new-celebrity");
});

//Route POST to Add New Celebrity
router.post("/create", guardRoute, uploadRoute.single("image"), (req, res, next) => {
  Celebrity.create({
    name: req.body.name,
    image: req.file.path,
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
router.get("/", guardRoute, (req, res, next) => {
  Celebrity.find().populate("movie")
    .then((allCelebrities) => {
      res.render("celebrities/celebrities", { celebrities: allCelebrities });
    })
    .catch((err) => {
      next(err);
    });
});


//Route to display Celebrity details
router.get("/:theId", guardRoute, (req, res, next) => {
  Celebrity.findById(req.params.theId).populate("movie")
    .then((dbCeleb) => {
      res.render("celebrities/celebrity-details", dbCeleb);
    })
    .catch((err) => {
      next(err);
    });
});

//UPDATE
//Route GET to edit a Celebrity
router.get("/:theId/edit", guardRoute, (req, res, next) => {
  Celebrity.findById(req.params.theId).populate("movie")
  .then((dbCeleb) => {
    Movie.find()
    .then(allMovies => {
      allMovies.forEach(movie => {
        dbCeleb.movie.forEach(movieCast => {
          if(movie._id.equals(movieCast._id)){
            movie.isinthemovielist = true;
          }
        })
      });
      res.render("celebrities/edit-celebrity", {dbCeleb, allMovies});
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
});

//Route POST to edit a Celebrity
router.post("/:theId", guardRoute, (req, res, next) => {
  const {name, occupation, catchPhrase, movie} = req.body; 
  Celebrity.findByIdAndUpdate(req.params.theId, {name, occupation, catchPhrase, movie}, {new: true})
  .then((dbCeleb) => {
        console.log(movie);
        //Search Movie Cast and adding Celeb if not there
        movie.forEach(movieMember => {
          Movie.findById(movieMember)
          .then((dbMovie) =>{
              if(!dbMovie.cast.includes(dbCeleb._id)){              
                dbMovie.cast.push(dbCeleb._id);
                dbMovie.save();
              }
          })
          .catch(err => next(err));  
        });
    req.flash("successMessage", "Celebrity successfully updated.")
    res.redirect(`/celebrities/${req.params.theId}`);
  })
  .catch((err) => {
    next(err);
  });
});







//DELETE
//Route to delete a Celebrity
router.post("/:theId/delete", guardRoute, (req, res, next) => {
  Movie.find()
  .then((dbMovie) => {
    dbMovie.forEach(theMovie => {
      theMovie.cast.forEach((celeb, index) => {
        if(celeb._id.equals(req.params.theId)){
          theMovie.cast.splice(index, 1);
        }
      })
    })

    Celebrity.findByIdAndDelete(req.params.theId)
    .then((dbCelebrity) => {
      req.flash("successMessage", "Celebrity successfully removed");
      res.redirect("/celebrities");
    })
    .catch((err) => {
      req.flash("errorMessage","Something went wrong.");
      next(err);
    });
  })
  .catch((err) => {
    req.flash("errorMessage","Something went wrong.");
    next(err);
  });
});

module.exports = router;