// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");

// all your routes here
//CREATE
//Route GET to Add New Celebrity
router.get("/create", (req, res, next) => {
  res.render("celebrities/new-celebrity");
});

//Route POST to Add New Celebrity
router.post("/create", (req, res, next) => {
  Celebrity.create({
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
  })
    .then((result) => {
      res.redirect("/celebrities");
    })
    .catch((err) => {
      res.redirect("/new-celebrity");
    });
});


//READ
//Route to display all Celebrities
router.get("/", (req, res, next) => {
  Celebrity.find()
    .then((allCelebrities) => {
      res.render("celebrities/celebrities", { celebrities: allCelebrities });
    })
    .catch((err) => {
      next(err);
    });
});


//Route to display Celebrity details
router.get("/:theId", (req, res, next) => {
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



//DELETE
//Route to delete a Celebrity
router.post("/:theId/delete", (req, res, next) => {
  Celebrity.findByIdAndDelete(req.params.theId)
  .then((dbCelebrity) => {
    res.redirect("/celebrities");
  })
  .catch((err) => {
    next(err);
  })
})



module.exports = router;