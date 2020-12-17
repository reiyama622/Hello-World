/* 
Copied parts from Lab13 and Lab14 from https://dport96.github.io/ITM352/ website when completed the lab in class.
*/

//data from products in variable data
var data1 = require('../Yamamoto_Rei_Assignment3/public/product_data.js');
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
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser'); //don't forget to install//
app.use(cookieParser());
var session = require('express-session'); 
app.use(session({
    secret: "ITM352 rocks!"}));  
//if the file exists read it 
if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename)
    console.log("Read  " + filename);
    //console.log(filename + 'has' + data.size + 'characters');
    data1 = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(data1);
} else { 
    console.log("Can't read file " + filename);
    exit();
}
//writes the requests in the console and the path
app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path);
    next();
});

// Gennerates each page where there is a product
app.get("*/:ptype[.]html", function (request, response, next) {
    if (typeof products[request.params.ptype] == 'undefined')
    {
      next();
      return;
    }
    // Referenced from professor Port // 
    var str = '{}'; 
    //Used template to load pages from the server, from professor 
     var pagestring = fs.readFileSync('./displayproducts.html', 'utf-8'); 
     pagestring = `<script> var cart = ${str}; </script>` + pagestring; //so the cart shows in the console
     pagestring = `<script> var product_type = '${request.params.ptype}'; </script>` + pagestring;
     response.send(pagestring);
  });

//get data in the body
app.use(myParser.urlencoded({ extended: true })); 

//from ex4 lab13
//takes the data from the query string and puts it in the invoice
app.post("/process_purchase", function (request, response) {
    let POST = request.body;
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
            response.redirect('./products_display.html?' + queryString.stringify(request.query));
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

//Allows us to load in the cart page , reference from professor
app.get("/invoice.html", function (request, response) {
    var cartfile = `<script> var cart = ${JSON.stringify(request.session)}</script>`;
    cartfile += fs.readFileSync('./public/invoice.html', 'utf-8'); // add it onto the cart page which is in public
    response.send(cartfile);
  
  });


//to precess the registration page
app.post("/process_register", function (request, response) {
    let POST = request.body;
    console.log(request.query);
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
        data1 = JSON.stringify(user_data);
        fs.writeFileSync(filename, data1, "utf-8");
        //if valid registration data, redirect to the invoice with the quantities chosen on the store page
        response.redirect('./products_display.html?' + queryString.stringify(request.query));
    }
    //if there are errors do not register
    if (errors.length > 0) {
        console.log(errors);
        response.send('You have these errors in your registration: ' + errors + " ");
    }
});

//from ex4 lab13
//takes the data from the query string and puts it in the invoice
app.post("/process_form", function(request, response) {
    let POST = request.body; 
    let product_type = POST["product_type"];
  console.log(POST);
    //if the quantity input is not undefined, loop through and post the values to quesy string.
    if (typeof POST['checkOut'] != 'undefined') {
        var hasValidQuantities=true;
        var hasQuantities=false;
        for (var i = 0; i < products[product_type].length; i++) {
            var qty = POST[`quantity${i}`];
            hasQuantities = hasQuantities || qty > 0;
            hasValidQuantities = hasValidQuantities && isNonNegInt(qty);    
        } 
        const stringified = queryString.stringify(POST);
        //redirects to the login page if the quantities are valid
        if (hasValidQuantities && hasQuantities) {
            request.session[product_type] = POST; 
            console.log(request.session);
            response.redirect("./invoice.html?"+stringified); 
        }  
        //outputs 
        else {response.send('You did not enter a valid quantity')} 
    }
});
//copied from Port Display_and_mail_invoice_example from the ITM352 Fall 2020 cyber duck server.
app.get("/checkout", function (request, response) {
    var user_email = request.query.email; // email address in querystring
  // Generate HTML invoice string
    var invoice_str = `Thank you for your order ${user_email}!<table border><th>Quantity</th><th>Item</th>`;
    var cart = request.session[request.params.ptype];
    for(product_type in products) {
      for(var i=0; i<products[product_type].length; i++) {
        var str = '{}'; 
        if( typeof cart != 'undefined') {
          str = JSON.stringify(cart);
        }
          var qty = str[i];
          if(qty > 0) {
            invoice_str += `<tr><td>${qty}</td><td>${products[product_type][i].name}</td><tr>`;
          }
      }
  }
    invoice_str += '</table>';
  // Set up mail server. Only will work on UH Network due to security restrictions
    var transporter = nodemailer.createTransport({
      host: "mail.hawaii.edu",
      port: 25,
      secure: false, // use TLS
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
    var mailOptions = {
        from: 'phoney_store@bogus.com',
        to: user_email,
        subject: 'Your phoney invoice',
        html: invoice_str
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          invoice_str += '<br>There was an error and your invoice could not be emailed :(';
        } else {
          invoice_str += `<br>Your invoice was mailed to ${user_email}`;
        }
        response.send(invoice_str);
      });
     
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