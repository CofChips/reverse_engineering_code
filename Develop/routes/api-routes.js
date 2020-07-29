// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport"); //i.e. local strategy

module.exports = function(app) { //required in server.js
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) { //post route where request is sent to /api/login. passport.authenticate is middleware for passport used in express - setting to local strategy.
    res.json(req.user); //json data not actually used - members page redirect occurs (check login.js) as long as the post route is successful 
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({ //using the User model and sequelize create (i.e. INSERT INTO) to add an entry into the db
      email: req.body.email, //email key in the object
      password: req.body.password //password key in the object
    })
      .then(function() {
        res.redirect(307, "/api/login"); //temporary redirect "resource has moved to new URL". Method and body are not changed when redirect occurs.
      })
      .catch(function(err) {
        res.status(401).json(err); //unauthorized
      });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout(); //passport function that removes the req.user property and clears the login session (if any).
    res.redirect("/"); //redirects to root route
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });
};
