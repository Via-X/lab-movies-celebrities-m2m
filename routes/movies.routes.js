// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");
const guardRoute = require("../utils/guardroute");
const uploadRoute = require("../config/cloud");


//CREATE
//Route GET to Add New Movie
router.get("/create", guardRoute, (req, res, next) => {
  Celebrity.find()
    .then((allCelebrities) => {
      res.render("movies/new-movie", {allCelebrities});
    })
    .catch((err) => {
      next(err);
    });
});

//Route POST to Add New Movie
router.post('/create', guardRoute, uploadRoute.single("movimage"), (req, res, next) => {
  Movie.create({
    title: req.body.movtitle,
    genre: req.body.movgenre,
    image: req.file.path,
    plot: req.body.movplot,
    donor: req.session.currentUser._id
  })
  .then((dbMovie) => {
    dbMovie.cast.push(req.body.movcelebrity);
    dbMovie.save();
    Celebrity.findById(req.body.movcelebrity)
    .then((dbCeleb) => {
      dbCeleb.movie.push(dbMovie._id);
      dbCeleb.save();
    })
    .catch((err) => next(err));
    req.flash("successMessage", "Movie successfully added");
    res.redirect("/movies");
  })
  .catch((err) => {
    req.flash("errorMessage", "Sorry something went wrong:" + err);
    res.redirect("movies/create");
  });
});


//READ
//Route to display all Movies
router.get("/", guardRoute, (req, res, next) => {
  Movie.find()
    .then((allMovies) => {
      res.render("movies/movies", { movies: allMovies });
    })
    .catch((err) => {
      next(err);
    });
});


//Route to display Movie Details
router.get("/:theId", guardRoute, (req, res, next) => {
  Movie.findById(req.params.theId).populate("cast").populate("donor")
  .then((dbMovie) => {
    const donorMatch = dbMovie.donor.equals(req.session.currentUser._id)
    res.render("movies/movie-details",{dbMovie, donorMatch});
  }) 
  .catch((err) => {
    next(err);
  });
});


//UPDATE
//Route GET to edit a Movie
router.get("/:theId/edit", guardRoute, (req, res, next) => {
  Movie.findById(req.params.theId).populate("cast")
  .then((theMovie)=> {
    Celebrity.find()
    .then(allCelebrities => {
      allCelebrities.forEach(celeb => {
        theMovie.cast.forEach(castMember => {
          if(celeb._id.equals(castMember._id)){
            celeb.isinthecast = true;
          }
        }) 
      });
      res.render("movies/edit-movie", {theMovie, allCelebrities});
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
});

//Route POST to edit a Movie
router.post("/:theId", guardRoute, (req, res, next) => {
  const {title, genre, plot, cast} = req.body; 
  Movie.findByIdAndUpdate(req.params.theId, {title, genre, plot, cast}, {new: true})
  .then((dbMovie) => {
        console.log(cast);
        //Search Celebrity Movies and adding movie if not there
        cast.forEach(castMember => {
          Celebrity.findById(castMember)
          .then((dbCeleb) =>{
              if(!dbCeleb.movie.includes(dbMovie._id)){              
                dbCeleb.movie.push(dbMovie._id);
                dbCeleb.save();
              }
          })
          .catch(err => next(err));  
        });
    req.flash("successMessage", "Movie successfully updated.")
    res.redirect(`/movies/${req.params.theId}`);
  })
  .catch((err) => {
    next(err);
  });
});


//DELETE 
//Route to delete a Movie and Cast Members with Async/Await
router.post("/:theId/delete", guardRoute, async (req, res, next) => {
  // guardRoute(req, res);

  try {
      const dbMovie = await Movie.findById(req.params.theId).populate("cast");
      if(!dbMovie.donor.equals(req.session.currentUser._id)){
        res.redirect("/");
        return;
      }
        dbMovie.cast.forEach(castMember => {
        Celebrity.findById(castMember)
        .then((dbCeleb) => {
          if(dbCeleb.movie.includes(dbMovie._id)){
            dbCeleb.movie.splice(dbCeleb.movie.indexOf(dbMovie._id),1);
            dbCeleb.save();
          }
        })
        .catch(error => {
          next(error);
        });
      });

      const deletedbMovie = await Movie.findByIdAndDelete(req.params.theId);
      req.flash("successMessage", "Movie successfully removed");
      res.redirect("/movies");
      } catch (error) {
      };
});

module.exports = router;
