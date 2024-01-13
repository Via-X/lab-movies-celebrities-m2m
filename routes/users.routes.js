const express = require("express");
const router = express.Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs");


//CREATE
//Route GET to create a User
router.get("/signup", (req, res, next) =>{
  res.render("users/signup")
});

//Route POST to create a User
router.post("/signup", async (req, res, next) => {
  const saltRounds = 10;
  const {username, email, password } = req.body;
  try{
      const salt = await bcryptjs.genSalt(saltRounds);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const newUser = await User.create({
          username: username,
          email: email,
          password: hashedPassword
      })
      res.redirect("/");
  } catch(err) {
    next(err);
  }

});

//READ
//Route GET to login user
router.get("/login", (req, res, next) => {
  res.render("users/login");
});

//Route POST to login user
router.post("/login", (req, res, next) => {
  const {email, password} = req.body;

  // if (email === '' || password === '') {
  //   res.render('/login', {
  //     errorMessage: 'Please enter both, email and password to login.'
  //   });
  //   return;
  // }

  User.findOne({email: email})
  .then(dbUser => {
      if(!dbUser){
        res.redirect('/login');
        return;
      } else if (bcryptjs.compareSync(password, dbUser.password)){
        
        // saves the entire session
        // req.session.currentUser = dbUser;

        req.session.currentUser = {
          _id: dbUser._id,
          username: dbUser.username,
          email: dbUser.email
        };

        res.redirect('/movies');
      } else {
        res.redirect('/celebrities');
        return;
      }
  })
  .catch(error => next(error));
})


//UPDATE
//Route POST to logout
router.post("/logout", (req, res, next) => {
  req.session.destroy(error => {
    if(error) {
      next(error);
    }
    res.redirect("/");
  })
})



module.exports = router;