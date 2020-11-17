var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
const { exit } = require('process');

app.use(myParser.urlencoded({ extended: true }));

var filename = "user_data.json";

if (fs.existsSync(filename)) {
    var data = fs.readFileSync(filename, 'utf-8');
    //console.log("Success! We got: " + data);

    var user_data = JSON.parse(data);
    console.log("user_data=", user_data);
} else {
    console.log("Sorry can't read file " + filename);
    exit();
}


 /*
check to see if the data entered is valid.
check to see if username is more than 4 but less than 10
check it is only letters and numbers
if not error. 
*/
var usernameErrors = [];
function validUsernameCheck(username){
    var usernameLength = POST["username"].length;
    var letters = /^[A-Za-z]+$/;
    var numbers = /^[0-9]+$/;
    if((usernameLength != 0 || usernameLength > 4 && usernameLength < 10) && (POST["username"].match(letters) || POST["username"].match(numbers))){
       return true
    }else{
       usernameErrors.push('Username must have letters and numbers only and be between 4 and 10 characters');
       return false
    }
}

/*check to see if the username is taken*/
/*
function alreadyUsed(username){
    var usernameInput = POST["username"];
for (var i=0; i < filename.length; i++) {
    if (filename[i].name == username){
        usernameErrors.push('This Username is already taken');
         return true;
    } else{
        return false;
    }
}
*/
/*
check password
minimum of six characters
case sensitive
*/
var passErrors = [];
function passwordCheck(password){
    var passwordLength = POST["password"].length;
    if (passwordLength != 0 && passwordLength >= 6){
        return true;
    }
    //if it is already being used
    //goes through 
    else{
        passErrors.push('Password must be atleast 6 characters');
        return false;
    }
}
/*
Check if email is valid
Used code from https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.ph
*/
var emailErrors = [];
function validateEmail(uemail){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(POST["email"].match(mailformat)){
       return true;
    }else{
       emailErrors.push('You have entered an invalid email address!');
       return false;
    }
}

app.get("/register", function (request, response) {
    // Give a simple register form
    var str = `
<body>
<form action="/register" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" required><br />
<input type="password" name="password" size="40" placeholder="enter password" required><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again" required><br />
<input type="email" name="email" size="40" placeholder="enter email" required><br />
<input type="submit" value="Submit" id="submit">
<div class="container signin">
Have an account? <a onclick="window.location='./login'+window.location.search;"> Click Here</a>

</div>
</form>
</body>
    `;
    response.send(str);
});

app.post("/register", function (request, response) {
    // process a simple register form
    POST = request.body;
    console.log("Got register POST");
    if ((POST["username"] != undefined && POST['password'] != undefined) && (validUsernameCheck(POST["username"])==true && passwordCheck(POST["password"])==true && validateEmail(POST["email"])==true) /*&& alreadyUsed==false*/) {          // Validate user input
        var username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST['password'];
        user_data[username].email = POST['email'];

        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");
        res.redirect('./invoice.html?' + queryString.stringify(req.query))
        response.send("User " + username + " logged in");
    }else{
        response.send(`You have these errors with your registration. <br> Username: ${usernameErrors} <br> Password: ${passErrors} <br> Email: ${emailErrors}`)
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));