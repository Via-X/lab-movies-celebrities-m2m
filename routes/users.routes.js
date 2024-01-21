const express = require("express");
const router = express.Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs");
const guardRoute = require("../utils/guardroute");
const nodemailer = require("nodemailer");
const transporter = require("../config/nodemailer");

//LOGOUT
//Route POST to logout
router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if(error) {
      next(error);
    }
    res.redirect("/login");
  });
});

//FORGOT USER PASSWORD
//Route GET to Reset Password
router.get("/forgot-password", (req, res, next) => {
  res.render("users/forgot");
});

//Route POST to Reset Password
router.post("/reset-password", async (req, res, next)=>{
  const theEmail = req.body.theEmail;
  
  try{
    const theUser = await User.findOne({email: theEmail});
    if(!theUser){
      req.flash("errorMessage", "Email Not Found")
      res.redirect("/forgot-password");
      return;
    } else {
      let theNewPassword = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 10) {
        theNewPassword += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(theNewPassword, salt)
      const theUpdate = await User.findByIdAndUpdate(
        theUser._id,
        {password: hashedPassword}
        );
  
      const info2 = await transporter.sendMail({
        from: "mvia2000@mail.com", // sender address
        to: theEmail,
        subject: "Password Reset", // Subject line
        text: "You Requested to reset your password", // plain text body
        html: `<b>You requested to reset your password</b> 
        <p>your temporary password is ${theNewPassword}</p>`, // html body
      });
      res.redirect("/login");
    }
  } catch(err){
    next(err);
  }
});


//CREATE USER
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
      
      const info = await transporter.sendMail({
        from: "movies_celebs_appe@mail.com", // sender address
        to: email,
        subject: "Thank you for signing up", // Subject line
        text: "Thank you for signing up", // plain text body
        html: `<b>Thank you for signing up, ${username}</b>`, // html body
      });


      res.redirect("/login");
  } catch(err) {
      // req.flash("errorMessage", "MAJOR ERROR" + err);
      next(err);
  }
});

//LOGIN
//Route GET to login user
router.get("/login", (req, res, next) => {
  res.render("users/login");
});

//Route POST to login user
router.post("/login", (req, res, next) => {
  const {email, password} = req.body;

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
          email: dbUser.email,
          admin: dbUser.admin,
          standarduser: dbUser.standarduser,
          readonly: dbUser.readonly
        };

        res.redirect('/');
      
      } else {
        req.flash("errorMessage","Email and password combination not found");
        res.redirect('/login');
  
      }
  })
  .catch(error => next(error));
})

//DISPLAY ALL USERS
//Route to display all User Accounts
router.get("/users", guardRoute, (req, res, next) => {
  User.find()
    .then((allUsers) => {
      res.render("users/users", { allUsers});
    })
    .catch((err) => {
      next(err);
    });
});


//DISPLAY AND UPDATE USER DETAILS
//Route to display User Account details
router.get("/:theId", guardRoute, (req, res, next) => {
  User.findById(req.params.theId)
    .then((dbUser) => {
      // dbUser.admin = Number(dbUser.admin);
      // dbUser.standarduser = Number(dbUser.standarduser);
      // dbUser.readonly = Number(dbUser.readonly);
      res.render("users/user-details", dbUser);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:theId", guardRoute, async (req, res, next) => {
  // const saltRounds = 10;
  try{
      // const salt = await bcryptjs.genSalt(saltRounds);
      // const hashedPassword = await bcryptjs.hash(req.body.password, salt);
      const currentUser = await User.findByIdAndUpdate(req.params.theId, {
          // username: username,
          email: req.body.email,
          // password: hashedPassword,
          admin: Boolean(req.body.admin),
          standarduser: Boolean(req.body.standarduser),
          readonly: Boolean(req.body.readonly)
      }, {new: true})
      req.flash("successMessage", "Account successfully updated.");
      res.redirect(`/${req.params.theId}`);
  } catch(err) {
      req.flash("errorMessage", "MAJOR ERROR" + err);
      next(err);
  };
});





module.exports = router;