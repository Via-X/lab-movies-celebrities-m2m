// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");

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
//Route GET to Add New Movie
router.get("/create", (req, res, next) => {
  guardRoute(req, res);
  Celebrity.find()
    .then((allCelebrities) => {
      res.render("movies/new-movie", {allCelebrities});
    })
    .catch((err) => {
      next(err);
    });
});

//Route POST to Add New Movie
router.post('/create', (req, res, next) => {
  guardRoute(req, res);
  Movie.create({
    title: req.body.movtitle,
    genre: req.body.movgenre,
    plot: req.body.movplot,
    donor: req.session.currentUser._id
  })
  .then((dbMovie) => {
    dbMovie.cast.push(req.body.movcelebrity);
    dbMovie.save();
    console.log(`movcelebrity : ${req.body.movcelebrity}`);
    Celebrity.findById(req.body.movcelebrity)
    .then((dbCeleb) => {
      dbCeleb.movie.push(dbMovie._id);
      dbCeleb.save();
      console.log("DBCELEB:"+dbCeleb.movie);
    })
    .catch((err) => next(err));
    req.flash("successMessage", "Movie successfully added");
    res.redirect("/movies");
  })
  .catch((err) => {
    req.flash("errorMessage", "Sorry something went wrong");
    res.redirect("/create");
  });
});


//READ
//Route to display all Movies
router.get("/", (req, res, next) => {
  //Insert Auth
  guardRoute(req, res);
  console.log(req.session);
  Movie.find()
    .then((allMovies) => {
      res.render("movies/movies", { movies: allMovies });
    })
    .catch((err) => {
      next(err);
    });
});


//Route to display Movie Details
router.get("/:theId", (req, res, next) => {
  guardRoute(req, res);
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
router.get("/:theId/edit", (req, res, next) => {
  guardRoute(req, res);
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
router.post("/:theId", (req, res, next) => {
  guardRoute(req, res);
  const {title, genre, plot, cast} = req.body; 
  Movie.findByIdAndUpdate(req.params.theId, {title, genre, plot, cast}, {new: true})
  .then((dbMovie) => {

        //Search Celebrity Movies and adding movie if not there
        cast.forEach(castMember => {
          Celebrity.findById(castMember)
          .then((dbCeleb) =>{
              console.log("XXX Celeb: " + dbCeleb);
              if(!dbCeleb.movie.includes(dbMovie._id)){
               
                dbCeleb.movie.push(dbMovie._id);
                dbCeleb.save();
                console.log("XXXX Added"+ dbCeleb + "movie id" + dbMovie._id)
              }
         

          })
          //Search Celebrity Movies and removing if there
          //On condition if removed during edit.

          .catch(err => next(err));  
        });
    res.redirect(`/movies/${req.params.theId}`);
  })
  .catch((err) => {
    next(err);
  });
});


//DELETE 
//Route to delete a Movie and Cast Members with Async/Await
router.post("/:theId/delete", async (req, res, next) => {
  guardRoute(req, res);

  try {
      const dbMovie = await Movie.findById(req.params.theId);
      if(!dbMovie.donor.equals(req.session.currentUser._id)){
        res.redirect("/");
        return;
      }
      dbMovie = await Movie.findByIdAndDelete(req.params.theId).populate("cast");
      
      //Search Celebrities as Movie cast members and delete them as well
      const allCelebrities = await Celebrity.find(); 
      allCelebrities.forEach((celeb) => {
        dbMovie.cast.forEach((castMember) => {
          if(celeb._id.equals(castMember._id)){
            Celebrity.findByIdAndRemove(celeb._id)
            .then(() => {console.log(celeb.name)})
            .catch((err) => next(err));
          }
        });
      });
      

      res.redirect("/movies");
      } catch (error) {
          console.log("ERROR");
      }
});

module.exports = router;
