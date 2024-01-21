function guardRoute(req, res, next){
  if(!req.session.currentUser){
    req.flash("errorMessage", "You must be logged in to access this.");
    //Check if already redirected
    // if(!res.headerSent){
      res.redirect("/login");
    // }
    return;
  };
  next();
}

module.exports = guardRoute;