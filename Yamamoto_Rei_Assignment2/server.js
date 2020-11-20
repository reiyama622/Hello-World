/* 
Copied parts from Lab13 and Lab14
*/

//data from product_data in variable data
var data1 = require('../Yamamoto_Rei_Assignment1/public/product_data.js');
//set products to equal the products from the data variable
var products = data1.products; 
//query string into an object
var queryString = require('query-string'); 
//load and cache express module
var express = require('express'); 
var app = express();
//load and cache body parser module
var myParser = require("body-parser"); 
var filename = 'user_data.json';
//Load file system
var fs = require('fs'); 

//if the file exists read it 
if (fs.existsSync(filename)) {
    var data = fs.statSync(filename)
    console.log("Read  " + filename);
    //console.log(filename + 'has' + data.size + 'characters');
    data = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(data);
} else { 
    console.log("Can't read file " + filename);
    exit();
}
//writes the requests in the console and the path
app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path);
    next();
});
//get data in the body
app.use(myParser.urlencoded({ extended: true })); 

//from ex4 lab13
//takes the data from the query string and puts it in the invoice
app.post("/process_purchase", function (request, response) {
    POST = request.body;
    if (typeof POST['submitPurchase'] != 'undefined') {
        var hasvalidquantities=true; 
        var hasquantities=false
//loops through quantites to ensure valid
    //grater than 0, true, non negative int
    for (var i = 0; i < products.length; i++) {
        var qty=POST[`quantity${i}`];
        hasquantities=hasquantities || qty>0
        hasvalidquantities=hasvalidquantities && isNonNegInt(qty);
    } 
// if all quantities are valid, generate the invoice// 
    const stringified = queryString.stringify(POST);
    if (hasvalidquantities && hasquantities) {
        //redirects to login if valid quantities
        response.redirect("./login.html?"+stringified);
    }else {
        response.redirect("./products_display.html?" + stringified);
    }
    }
});
    
 //repeats the isNonNegInt function from the index.html file because there is no relation between the index.html page and server//
function isNonNegInt(q, returnErrors = false) {
    var errors = []; // assume that quantity data is valid//
    if (q == ""){ 
        q = 0; 
    }
     //check if it is a number
    if (Number(q) != q) errors.push('Not a number!');
     //check if value is a positive number
    if (q < 0) errors.push('Negative value!');
     //check if value is a whole number
    if (parseInt(q) != q) errors.push('Not an integer!');
    return returnErrors ? errors : (errors.length == 0);
}
// Process a login
app.post("/process_login", function (request, response) {
    var loginError = [];
    console.log(request.query);
    var usernameInput = request.body.username.toLowerCase();
    //check if the username is in the JSON file
    if (typeof user_data[usernameInput] != 'undefined') {
        //if the password matched the username direct to invoice
        if (user_data[usernameInput].password == request.body.password) {
            request.query.username = usernameInput;
            //log to the console
            console.log(user_data[request.query.username].name);
            request.query.name = user_data[request.query.username].name
            //direct to invoice if log in is valid (matches username on file and matches password)
            response.redirect('./invoice.html?' + queryString.stringify(request.query));
            return;
        //if usermane or password is invalid redirect to login
        } else {
            //logs to the console the login errors
            console.log(loginError);
            request.query.username= usernameInput;
            request.query.name= user_data[usernameInput].name;
            //joins the errors with a ;
            request.query.loginError=loginError.join(';');
        }
    //logs to the console if there is an error with the username (does not exist)
    } else {
        loginError.push = ('Invalid Username');
        request.query.loginError=loginError.join(';');
    }
    response.redirect('./login.html?' + queryString.stringify(request.query));
});
//to precess the registration page
app.post("/process_register", function (request, response) {
    POST = request.body;
    console.log(POST);
    var errors = [];

    /*Validate user registration input values*/
    //validating full name only letters and defined
    if (/^[A-Za-z]+$/.test(POST['name']) || (POST['name'] != "undefined")) {
        console.log('valid name');
    }else {
        errors.push('Use Letters Only for Full Name, Full Name undefined');
    }

    //check is username is between 4 and 10 characters and only letters and numbers
    if ((/.{3,10}/ .test(POST['username'])) && (/^[a-zA-Z0-9]*$/.test(POST['username']))) {
        console.log('valid username');
    }else {
        errors.push('Username must be between 4 and 11 characters, letters and numbers only');
    }

    //check if username is taken
    var reguser = POST['username'].toLowerCase(); 
    if (typeof user_data[reguser] != 'undefined') { 
        errors.push('Username taken');
    }else{
        console.log('New username');
    }  
        
    //validate email address checks that it is in the correct format
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(POST['email'])) {
        console.log('valid email');
    }else {
        errors.push('Invalid email');
    }

    //validate the password makes sure that the  password is min 6 characters long 
    if (POST['password'].length < 6) {
        errors.push('Password Too Short');
    }else{
    console.log('valid Password length');
    }

    // check to see if passwords match
    if (POST['password'] == POST['repeat_password']) { 
          console.log('passwords match');
    }else{
        errors.push('Passwords do not match');
    }

    //if there are no errors, register user
    if (errors.length == 0) {
        console.log('no errors');
        //post to the JSON file the registered user data
        //username, password, email
        var username = POST["username"];
        user_data[username] = {};
        user_data[username].name = username;
        user_data[username].password = POST['password'];
        user_data[username].email = POST['email'];
        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");
        //if valid registration data, redirect to the invoice with the quantities chosen on the store page
        response.redirect('./invoice.html?' + queryString.stringify(request.query));
    }
    //if there are errors do not register
    if (errors.length > 0) {
        console.log(errors);
        response.send('You have these errors in your registration: ' + errors + " ");
    }
});

//from ex4 lab13
//takes the data from the query string and puts it in the invoice
app.post("/process_form", function (request, response) {
    POST = request.body; 
    //if the quantity input is not undefined, loop through and post the values to quesy string.
    if (typeof POST['checkOut'] != 'undefined') {
        var hasValidQuantities=true;
        var hasQuantities=false;
        for (var i = 0; i < products.length; i++) {
            var qty = POST[`quantity${i}`];
            hasQuantities = hasQuantities || qty > 0;
            hasValidQuantities = hasValidQuantities && isNonNegInt(qty);    
        } 
        const stringified = queryString.stringify(POST);
        //redirects to the login page if the quantities are valid
        if (hasValidQuantities && hasQuantities) {
            response.redirect("./login.html?"+stringified); 
        }  
        //outputs 
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
app.use(express.static('./public')); //Creates a static server using express from the public folder
app.listen(8080, () => console.log(`listening on port 8080`));