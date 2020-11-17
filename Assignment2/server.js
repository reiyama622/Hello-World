/* 
Used from Lab13
*/
//data from product_data in variable data
var data = require('../Yamamoto_Rei_Assignment1/public/product_data.js');
//set products to equal the products from the data variable
var products = data.products; 
//query string into an object
var queryString = require('query-string'); 

var express = require('express'); 
var app = express(); 
var myParser = require("body-parser"); 
// So it'll load querystring// 
var filename = 'user_data.json'; // new//
var fs = require('fs'); //Load file system//
//added just now
if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename) //gets stats from file
    console.log(filename + 'has' + stats.size + 'characters');

    data = fs.readFileSync(filename, 'utf-8');
    var users_reg_data = JSON.parse(data);
} else { 
    console.log(filename + 'does not exist!');
}
//writes the requests in the console
app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

//from ex4 lab13
//takes the data from the query string and puts it in the invoice
app.post("/process_form", function (request, response) {
        let POST = request.body; 
        if (typeof POST['checkOut'] != 'undefined') {
            var hasvalidquantities=true;
            var hasquantities=false;
            for (var i = 0; i < products.length; i++) {
                            var qty=POST[`quantity${i}`];
                            hasquantities=hasquantities || qty > 0;
                            hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    
            } 
            const stringified = queryString.stringify(POST);
            if (hasvalidquantities && hasquantities) {
                response.redirect("./invoice.html?"+stringified); 
            }  
            else {response.send('You did not enter a valid quantity')} 
        }
    });
    
    //checks for non neg inetegers
    function isNonNegInt(q, returnErrors = false) {
       var errors = [];
        if (q == "") {
             q = 0; 
        }
        if (Number(q) != q){
             errors.push('Not a number!');
        }
        if (q < 0){ 
             errors.push('Negative value!');
        }
        if (parseInt(q) != q) errors.push('Not an integer!'); 
        return returnErrors ? errors : (errors.length == 0);
    }
    //app.use(express.static('./public')); 
//app.listen(8080, () => console.log(`listening on port 8080`)); 

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

app.post("/register", function (request, response) {
    // process a simple register form
    var POST = request.body;
    console.log("Got register POST");
    if ((POST["username"] != undefined && POST['password'] != undefined) && (validUsernameCheck(POST["username"])==true && passwordCheck(POST["password"])==true && validateEmail(POST["emial"])==true)) {          // Validate user input
        var username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST['password'];
        user_data[username].email = POST['email'];

        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");

        response.send("User " + username + " logged in");
    }else{
        response.send(`You have these errors with your registration. <br> Username: ${usernameErrors} <br> Password: ${passErrors} <br> Email: ${emailErrors}`)
    }
});

//app.listen(8080, () => console.log(`listening on port 8080`));

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    // if the user exists it gets the password. to log in.
    if(typeof user_reg_data[request.body.username] != 'undefined'){
        if(request.body.password == user_reg_data[request.body.username].password){
            response.send(`Thank you ${request.body.username} for logging in`);
        }else{
            response.send(`Hey! ${request.body.password} does not match your username`);
        }
    }else{
            response.send(`Hey! ${request.body.username} does not exist.`);
    }
});
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));