$document.ready(function() {
}

function validateForm() {
    var email = document.forms["signin"]["email"].value;
    var password = document.forms["signin"]["password"].value;
    if (email == "chora@gmail.com" && password == "abc") {
        return true;
    }
    else{
      alert("wrong username/ password");
      return false;
    }
}