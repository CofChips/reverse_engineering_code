$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup"); //"form with the 'signup' class"
  var emailInput = $("input#email-input"); //"input with the 'email-input' id"
  var passwordInput = $("input#password-input"); //"input with the 'password-input' id"

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault(); //prevents auto-submission on page rendering
    var userData = {
      email: emailInput.val().trim(), //captures input value and trims spaces
      password: passwordInput.val().trim() //captures input value and trims spaces
    };

    if (!userData.email || !userData.password) { //if there's no email or password values entered return (empty)
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    emailInput.val(""); //clears input fields
    passwordInput.val(""); //clears input fields
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password) {
    $.post("/api/signup", { //ajax call to /api/signup route, sending object with email and password keys and values
      email: email,
      password: password
    })
      .then(function(data) {
        window.location.replace("/members"); //redirects to /members if successful
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr); //triggers function below if error
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON); //displays text on the element with an 'alert' id and 'msg' class
    $("#alert").fadeIn(500); //animated opacity
  }
});
