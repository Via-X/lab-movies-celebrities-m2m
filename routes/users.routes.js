const express = require("express");
const router = express.Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs");


//CREATE
//Route GET to create a User
router.get("/signup", (req, res, next) =>{
  res.render("users/signup");
  return;
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

  if (password.length < 5) {
    req.flash("errorMessage","Sorry password must be at least 5 characters");
    res.redirect('/login');
    return;
  }

  User.findOne({email: email})
  .then(dbUser => {
      if(!dbUser){
        req.flash("errorMessage", "User not found");
        res.redirect('/login');
       
      } else if (bcryptjs.compareSync(password, dbUser.password)){
        
        req.flash("successMessage", "Successfully Logged in");
        // saves the entire session
        // req.session.currentUser = dbUser;
        req.session.currentUser = {
          _id: dbUser._id,
          username: dbUser.username,
          email: dbUser.email
        };

        res.redirect('/login');
      
      } else {
        req.flash("errorMessage","Email and password combination not found");
        res.redirect('/login');
  
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