$(document).ready(function() {
  // Getting references to our form and inputs
  var loginForm = $("form.login"); //"form with the 'login' class"
  var emailInput = $("input#email-input"); //"input with the id 'email-input'"
  var passwordInput = $("input#password-input"); //"input with the id 'password-input'"

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", function(event) {
    event.preventDefault(); //prevents form from auto submitting on page rendering
    var userData = {
      email: emailInput.val().trim(), //captures email value and trims spaces
      password: passwordInput.val().trim() //captures password value and trims spaces
    };

    if (!userData.email || !userData.password) { //if there is no email or password return (empty)
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) { //ajax request sending object with email and password keys and respective values
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function() {
        window.location.replace("/members"); //redirects to /members if successful
        // If there's an error, log the error
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});
