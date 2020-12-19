/*  
    Mark Ushiroda's Assignment 3 Server
    Referenced from info_server_Ex4.js from Lab13 and from my Assignment 1 and 2
*/

//load products_data.js and set variable to 'data'
var data = require('./public/product_data.js');
//set variable 'allProducts' to the products_data.js file
var allProducts = data.allProducts; 
//read variable 'query-string' as the loaded query-string module
const queryString = require('query-string'); 
//load and cache express module
var express = require('express');
//set module to variable 'app' 
var app = express(); 
//load and cache body-parser module
var myParser = require("body-parser"); 
// load and cache fs module
var fs = require('fs');
// making the .json file to the variable 'user_info_file' 
var user_info_file = './user_data.json'; 
//open file user_data.json and assign it from userdata to a string variable
var userdata_file = fs.readFileSync(user_info_file, 'utf-8');
//convert string into json object
userdata = JSON.parse(userdata_file);
//set var cookieParser as the cookie-parser module
var cookieParser = require('cookie-parser');
//session variable is set for session module
var session = require('express-session');
//transfer data to the body
app.use(myParser.urlencoded({ extended: true })); 
//nodemailer module
const nodemailer = require("nodemailer"); 

//use cookie-parser middleware
app.use(cookieParser()); 

//used for all requests
app.all('*', function (request, response, next) { 
    //the request method and its path
    console.log(request.method + ' to ' + request.path); 
    next(); 
});

//fetch in cart.html to send data to server, server will generate invoice and send email to user, then the invoice will ge displayed in the page 
app.post("/generateInvoice", function (request, response) {
    //cart = parsed cartData
    cart = JSON.parse(request.query['cartData']); 
    // cookie = parsed cookieData
    cookie = JSON.parse(request.query['cookieData']);
    //divide cookie
    var theCookie = cookie.split(';'); 
    for (i in theCookie) {
        //function taken from stackoverflow.com
        function split(theCookie) { //split the cookie before the =
            var i = theCookie.indexOf("="); //everything before the =

            if (i > 0)
                return theCookie.slice(0, i);//cut off the rest of the string after =
            else {
                return "";
            }
        };

        //key = string before =
        var key = split(theCookie[i]); 

        //set to theUsername 
        if (key == ' username') { 
            //sets variable for username in cookie
            var theUsername = theCookie[i].split('=').pop();
        };

        //set email
        if (key == ' email') {
            //sets variable 'email'
            var email = theCookie[i].split('=').pop();
        };

    }
    console.log(email);
    console.log(theUsername);
    console.log(theCookie);

    //create a string with the invoice then email it to user and send back to cart for displaying on the browser (the below code is copied from invoice.html)

    str = `<link href="./invoice_style.css" rel="stylesheet">
    <header align="center">
    <!-- Center header on page -->
    <h1 style=color:black>Checkout</h1>
    <hr /> <!-- Title of page -->
    </header>
        <h3 align="center">Thank you, <font color="black">${theUsername}!</font><br />An email has been sent to <font color="black">${email}</font></h3>
    
            <table>
            <tbody>
            <tr>
                <!-- This row contains the column headers-->
                <th style="text-align: center;" width="43%">
                    <h3>Product</h3>
                </th>
                <th style="text-align: center;" width="11%">
                    <h3>Quantity</h3>
                </th>
                <th style="text-align: center;" width="54%">
                    <h3>Price</h3>
                </th>
                <th style="text-align: center;" width="13%">
                    <h3>Extended Price</h3>
                </th>
            </tr>
            `;
    //subtotal starts off as 0
    subtotal = 0; 
    for (product in allProducts) {
        for (i = 0; i < allProducts[product].length; i++) {

            qty = cart[`${product}${i}`];
            //if there is a quantity entered in the textbox
            if (qty > 0) { 
                //extended price equation
                extended_price = qty * allProducts[product][i].price 
                //adding extended price for each product to the subtotal
                subtotal += extended_price; 

                str += `
                    <tr>
                        <td align="center" width="43%"><font color="#000000">${allProducts[product][i].name}</font></td>
                        <td align="center" width="11%"><font color="#000000">${qty}</font></td>
                        <td align="center" width="13%"><font color="#000000">\$${allProducts[product][i].price}</font></td>
                        <td align="center" width="54%"><font color="#000000">\$${extended_price}</font></td>
                    </tr>
                `;

            }

        }

    }

    // Tax
    var tax_rate = 0.0471;
    var tax = tax_rate * subtotal;

    // Shipping
    if (subtotal <= 50) {
        shipping = 2;
        }
    else if (subtotal <= 100) {
        shipping = 5;
        }
    else {
        shipping = 0.05 * subtotal; // 5% of subtotal
        }
    // Compute grand total
    var total = subtotal + tax + shipping;

    str += `
            <tr>
                <!-- Creates row of space -->
                <td colspan="4" width="100%">&nbsp;</td>
            </tr>
            <tr>
                <!-- Sub-total row -->
                <td style="text-align: center;" colspan="3" width="67%"><b>SUB-TOTAL</b></td>
                <td align="center" width="54%"><b>$
                        ${subtotal}</b> <!-- input calculated subtotal amount -->
                </td>
            </tr>
            <tr>
                <!-- Tax row -->
                <td style="text-align: center;" colspan="3" width="67%"><b><span>TAX @
                            ${100 * tax_rate}%</span></b>
                </td>
                <td align="center" width="54%"><b>$
                        ${tax.toFixed(2)}</b>
                    <!-- Input calculated amount for tax, to two decimal places-->
                </td>
            </tr>
            <tr>
            <td  colspan="3" width="67%"><strong style=color:black>Shipping</td>
            <td width="54%">${shipping.toFixed(2)}</strong></td>
            </tr>
            <tr>
                <!-- Total row -->
                <td style="text-align: center;" colspan="3" width="67%">
                    <h3 style=color:black>Total</h3>
                </td>
                <td style="text-align: center;" width="54%"><strong style=color:black>$
                        ${total.toFixed(2)}</strong>
                    <!-- Input calculated total, to two decimal places -->
                </td>
            </tr>
        </tbody>
    </table>`;

    //this code was taken from nodemailer.com
    //create the transporter variable
    var transporter = nodemailer.createTransport({ 
        host: 'mail.hawaii.edu', //hawaii.edu USE HAWAII EMAIL
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        //sender is markushiroda@gmail.com
        from: 'markushiroda@gmail.com', 
        //email from the cookie from cart.html
        to: email, 
        subject: 'Invoice',
        //return as html in the body of the email
        html: str 
    };

    transporter.sendMail(mailOptions, function (error, info) {
        //if errors, sent to console
        if (error) {
            console.log(error);
        //notify me if email sent properly
        } else { 
            console.log('Email sent: ' + info.response);
        }
    });

    // string gets displayed in browser
    response.send(str);
});

//The following was taken from stormpath.com and Lab15 ex4.js
app.use(session({
    //random string to encrypt session ID
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    //save session
    resave: true, 
    //forget session after user is done
    saveUninitialized: false,
    //allows browser js from accessing cookies
    httpOnly: false, 
    //ensures cookies are only used over HTTPS
    secure: true,
    // deletes cookie when browser is closed
    ephemeral: true 
}));

//process the quantity_form when the POST request is initiated to form a response from the values in the form
app.post("/process_form", function (request, response) {
    let POST = request.body;

    //if the POST request is not undefined
    if (typeof POST['addProducts${i}'] != 'undefined') {
        // creates variable 'validAmount' and assumes it will be true
        var validAmount = true; 
        // create variable 'amount' and assuming it will be false
        var amount = false;

        //for any product in array
        for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) { 
            //set variable 'qty' to the value in quantity_textbox
            qty = POST[`quantity_textbox${i}`]; 

            if (qty > 0) {
                // works if value > 0
                amount = true; 
            }

            //if isNonNegInt is false then it is an invalid input,
            if (isNonNegInt(qty) == false) {
                // not a valid amount 
                validAmount = false;
            }

        }

        //converts the data in POST to a JSON string and sets it to variable 'stringified'
        const stringified = queryString.stringify(POST);

        //if it is both a quantity over 0 and is valid
        if (validAmount && amount) {
            // redirect the page to the login page
            response.redirect("./login.html?" + stringified);
            //stops function
            return;
        }

        //if there is invalid input, it re-routes back to the index page
        else { response.redirect("./index2.html?" + stringified) }

    }

});

//repeats the isNonNegInt function from the index2.html file because there is no relation between the index.html page and server
function isNonNegInt(q, return_errors = false) {
    // assume no errors
    errors = [];
    // nlank inputs = 0
    if (q == '') q = 0; 
    // Check if string is a number value
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); 
    // Check if it is non-negative
    if (q < 0) errors.push('<font color="red">Negative value</font>');
    // Check that it is an integer
    if (parseInt(q) != q) errors.push('<font color="red">Not a full amount</font>');
    return return_errors ? errors : (errors.length == 0);
}

//The following code is taken from Lab 14 Exercise 3
// Process login form POST and redirect to checkout if information in login page matches that in the login JSON file
app.post("/check_login", function (request, response) {
    //assume no errors at first
    errs = {};
    //set var login_username to the username field in login page
    var login_username = request.body["username"];
    //set variable
    var user_info = userdata[login_username]; 
    //set variable
    var login_password = request.body["password"];

    // If the username is not undefined
    if (typeof userdata[login_username] == 'undefined' || userdata[login_username] == '') {
        //If the username does not match, it will return this incorrect
        errs.username = '<font color="red">Incorrect Username</font>';
        //If username does not match anything in json file, password cannot match username
        errs.password = '<font color="red">Incorrect Password</font>';
    } else if (user_info['password'] != login_password) {
        //remove error
        errs.username = '';
        //wrong password
        errs.password = '<font color="red">Incorrect Password</font>';
    } else {
        //remove error
        delete errs.username; 
        //remove error
        delete errs.password;
    };

    //If no errors
    if (Object.keys(errs).length == 0) { 
        //the following was taken from Lab15 ex4.js
        //add username to user's session
        session.username = login_username; 
        //sets the time of login
        var theDate = Date.now();
        //remember this login time in session
        session.last_login_time = theDate;
        //set login name to the name saved for user
        var login_name = user_info['name'];
        //set email to the email saved for user
        var user_email = user_info['email'];
        //gives username in cookie
        response.cookie('username', login_username)
        //gives name in cookies
        response.cookie('name', login_name)
        //gives a cookie to user
        response.cookie('email', user_email);
        //give response parsed as json object
        response.json({});
    } else {
        //otherwise, show error message
        response.json(errs);
    };

});

//The below function was taken from w3resource.com
function ValidateEmail(inputText) {
    // email addresses can only contain letters, numbers, and the characters
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //if the input text matches requirements
    if (inputText.match(mailformat)) {
        //the function is true (it is a valid email)
        return true; 
    }
    else {
        //otherwise function is false
        return false;
    }
}

//The following function was copied from w3resource.com
function isAlphaNumeric(input) {
    //set variable to only numbers and letters
    var letterNumber = /^[0-9a-zA-Z]+$/;
    //input must only be letters or numbers to return true
    if (input.match(letterNumber)) {
        return true;
    }
    //non-numbers or letters will return false
    else {
        //otherwise function is false
        return false; 
    }
}

//The following code was taken from Lab 14 exercise 4
app.post("/register_user", function (request, response) {
    // process a simple register form
    //assume no errors
    errs = {};
    //set var registered_username to the username entered in registration page
    var registered_username = request.body["username"];
    //set var 'registered_name' to the entered name in register page
    var registered_name = request.body["name"]; 

    //username 
    //username required
    if (registered_username == '') { 
        errs.username = '<font color="red">Please Enter A Username</font>';
        // username between 4 and 10
    } else if (registered_username.length < 4 || registered_username.length > 10) {
        //error message
        errs.username = '<font color="red">Username Must Be Between 4 & 10 Characters</font>';
        //if username is not only letters and numbers
    } else if (isAlphaNumeric(registered_username) == false) { 
        //give error message
        errs.username = '<font color="red">Please Only Use Alphanumeric Characters</font>';
        //check if username already exists
    } else if (typeof userdata[registered_username] != "undefined") { 
        //return error message if username is taken
        errs.username = '<font color="red">Username Taken</font>';
    } else {
        errs.username = null;
    }

    //name 
    //name = less than 30 characters
    if (registered_name.length > 30) {
        errs.name = '<font color="red">Cannot Be Longer Than 30 Characters</font>';
    } else {
        errs.name = null;
    }

    //password
    //must have a password
    if (request.body.password.length == 0) {
        errs.password = '<font color="red">Please Enter A Password</font>';
        //must have a password at least 6 characters long
    } else if (request.body.password.length <= 5) {
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>';
        //Check if password is same as the repeat password field
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {
        errs.password = null;
        // let user know if passwords do not match
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>';
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

    //email
    //must have an email
    if (request.body.email == '') { 
        errs.email = '<font color="red">Please Enter An Email Address</font>';
        //if does not follow proper email format, give error
    } else if (ValidateEmail(request.body.email) == false) {
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>';
    } else {
        errs.email = null;
    }
    //Taken from stackoverflow.com
    //'result' will return false when each key in 'errs' is null
    let result = !Object.values(errs).every(o => o === null);
    //logs 'true' or 'false' for null keys to the console
    console.log(result); 

    if (result == false) { //If no errors
        //set the below variables to what was input by the user on the page
        //entered username replaces 'username' in json file
        userdata[registered_username] = {}; 
        //supplies name to be set to 'name' in json file
        userdata[registered_username].name = request.body.name;
        //supplies password to be set to 'password' in json file
        userdata[registered_username].password = request.body.password; 
        //supplies email to be set to 'email' in json file
        userdata[registered_username].email = request.body.email; 
        //input the fields filled out by user into the user_data.json file
        fs.writeFileSync(user_info_file, JSON.stringify(userdata, null, 2));
        //Set cookie for new user
        //sets username = registered_username in cookie
        response.cookie("username", registered_username); 
        //remembers name in cookie
        response.cookie("name", registered_name); 
        //remembers email in cookie
        response.cookie("email", request.body.email); 
        //give response parsed as json object
        response.json({});
    } else {
        //show error message
        response.json(errs);
    }

});

//The below code was taken from stormpath.com
app.post('/logout', function (request, response) {
    //clears session
    request.session.reset(); 
    //redirect user to index page
    response.redirect('/index.html');
});

//Creates static server using express from the public folder
app.use(express.static('./public'));
//run the server on port 8080 and write it in the console
app.listen(8080, () => console.log(`listening on port 8080`));