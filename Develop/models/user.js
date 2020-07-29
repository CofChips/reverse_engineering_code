// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require("bcryptjs");
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {  //column of email
      type: DataTypes.STRING, //string
      allowNull: false, //cannot be null
      unique: true, //must be unique
      validate: {
        isEmail: true //validation check for email format
      }
    },
    // The password cannot be null
    password: { //column of password
      type: DataTypes.STRING, //string
      allowNull: false //cannot be null
    }
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) { //object prototype "validPassword"
    return bcrypt.compareSync(password, this.password); //compares the hashed password in our database with the entered password 
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null); //hashing replaces password values with jumbled characters
  });
  return User;
};
