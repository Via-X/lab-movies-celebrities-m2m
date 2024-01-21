const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lab-movies-celebrities-m2m";


const saltRounds = 10;
const adminPassword = "Admin";
mongoose.connect(MONGO_URI)
.then(bdcon => {
    bcryptjs.genSalt(saltRounds)
    .then(salt => bcryptjs.hash(adminPassword, salt))
    .then(hashedPassword => {
        User.create({
            username: "admin",
            email: "admin@admin.com",
            password: hashedPassword,
            admin: true,
            standarduser: false,
            readonly: false
        })
        .then(dbAdmin => {
          console.log("Created Admin Account");
        })
        .catch(error => {
          console.log("Failure to create Admin account");
        });
    })
    .catch(error => {
      console.log("Failure to hash password")
    });

})
.catch(error => {
  console.log("Failure to Connect to DB.");
});

module.exports = router;





