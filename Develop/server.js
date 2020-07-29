// Requiring necessary npm packages
var express = require("express"); // Requiring express for server setup
var session = require("express-session"); // Requiring express-session, a middleware that will be used to keep track of user's login status
// Requiring passport as we've configured it
var passport = require("./config/passport"); // Requiring passport - an "Express-compatible authentication middleware"

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080; //This allows us to run on environments such as Heroku -> effectively is saying to run the environment variable PORT, or on local host 8080 if there is no environment port.
var db = require("./models"); //this is requiring the models directory and will be used to sync with the db

// Creating express app and configuring middleware needed for authentication
var app = express(); // Creates an instance of express app
app.use(express.urlencoded({ extended: true })); //Middleware; built-in express method to make sense of the incoming request object as strings or arrays - extended: true selects parsing with the qs library which "allows for a JSON-like" experience
app.use(express.json()); //Middleware; built-in express method to recognize the incoming request object as a JSON object
app.use(express.static("public")); //Middleware for serving static assets in the public directory
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true })); //this is the setup to use express session with parameters. 'Secret' is required and a key used for signing and/or encrypting cookies. 'saveUninitialized' allows us to store empty session objects to our session store (i.e. so that we can keep track of unique visitors even if the session object is empty).
app.use(passport.initialize()); //middleware to initialize Passport
app.use(passport.session()); //middleware for apps that use persistent login sessions

// Requiring our routes
require("./routes/html-routes.js")(app); //routes for directing user to html pages
require("./routes/api-routes.js")(app); //routes for querying database

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() { //syncs db
  app.listen(PORT, function() { //server "listening"
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT); //cosole logs a message - each %s inserts a string parameter (specified here as PORT)
  });
});
