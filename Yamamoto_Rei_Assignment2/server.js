/* 
Copied from info_server_Ex4.js from Lab13
*/

var data = require('../Yamamoto_Rei_Assignment1/public/product_data.js');
var products = data.products; 
const queryString = require('query-string'); //read variable 'queryString' as the loaded query-string module//
var express = require('express'); //load and cache express module//
var app = express(); //set module to variable 'app'//
var myParser = require("body-parser"); //load and cache body parser module//
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

app.all('*', function (request, response, next) { //for all request methods//
    console.log(request.method + ' to ' + request.path); //type in the console the request method and the path//
    next(); //keep going
});

app.use(myParser.urlencoded({ extended: true })); //get data in the body//

app.post("/process_purchase", function (request, response) {
        let POST = request.body; // data would be packaged in the body//
    
        if (typeof POST['submitPurchase'] != 'undefined') {
            var hasvalidquantities=true; // assuming that the variable will be true// 
            var hasquantities=false
            for (var i = 0; i < products.length; i++) {
                
                            var qty=POST[`quantity${i}`];
                            hasquantities=hasquantities || qty>0; // If its value is larger than 0 then it is good//
                            hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid//     
            } 
            // if all quantities are valid, generate the invoice// 
            const stringified = queryString.stringify(POST);
            if (hasvalidquantities && hasquantities) {
                response.redirect("./register.html?"+stringified); // using the invoice.html and all the data that is input//
            }  
            else {
                response.redirect("./products_display.html?" + stringified)
            }
        }
    });
    
    //repeats the isNonNegInt function from the index.html file because there is no relation between the index.html page and server//
    function isNonNegInt(q, returnErrors = false) {
        var errors = []; // assume that quantity data is valid//
        if (q == "") { q = 0; }
        if (Number(q) != q) errors.push('Not a number!'); //check if value is a number//
        if (q < 0) errors.push('Negative value!'); //check if value is a positive number//
        if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number//
        return returnErrors ? errors : (errors.length == 0);
    }
// login stuff starts here , add more comments and reference// 
app.post("/process_login", function (req, res) {
    var LogError = [];
    console.log(req.query);
    var the_username = req.body.username.toLowerCase();
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        if (users_reg_data[the_username].password == req.body.password) {
            req.query.username = the_username;
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name
            res.redirect('./invoice.html?' + queryString.stringify(req.query));
            return;
            //Redirect them to invoice here if they logged in correctly//
        } else {
            LogError.push = ('Invalid Password');
      console.log(LogError);
      req.query.username= the_username;
      req.query.name= users_reg_data[the_username].name;
      req.query.LogError=LogError.join(';');
        }
    } else {
        LogError.push = ('Invalid Username');
        console.log(LogError);
        req.query.username= the_username;
        req.query.LogError=LogError.join(';');
    }
    res.redirect('./login.html?' + queryString.stringify(req.query));
});

app.post("/process_register", function (req, res) {
    var qstr = req.body
    console.log(qstr);
    var errors = [];

    if (/^[A-Za-z]+$/.test(req.body.name)) {
    }
    else {
      errors.push('Use Letters Only for Full Name')
    }
    // validating name
    if (req.body.name == "") {
      errors.push('Invalid Full Name');
    }
    // length of full name is less than 30
    if ((req.body.fullname.length > 30)) {
      errors.push('Full Name Too Long')
    }
// length of full name is between 0 and 25 
  if ((req.body.fullname.length > 25 && req.body.fullname.length <0)) {
    errors.push('Full Name Too Long')
  }

    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { 
      errors.push('Username taken')
    }

    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) { }
    else {
      errors.push('Letters And Numbers Only for Username')
    }
  
    //password is min 8 characters long 
    if ((req.body.password.length < 8 && req.body.username.length > 20)) {
      errors.push('Password Too Short')
    }
    // check to see if passwords match
    if (req.body.password !== req.body.repeat_password) { 
      errors.push('Password Not a Match')
    }

    if (errors.length == 0) {
       console.log('none');
       req.query.username = reguser;
       req.query.name = req.body.name;
       res.redirect('./invoice.html?' + queryString.stringify(req.query))
    }
    if (errors.length > 0) {
        console.log(errors)
        req.query.name = req.body.name;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.repeat_password = req.body.repeat_password;
        req.query.email = req.body.email;

        req.query.errors = errors.join(';');
        res.redirect('./register.html?' + queryString.stringify(req.query))
    }
else{
    var username = POST["username"];
    user_reg_data[username] = {};
    user_reg_data[username].name = username;
    user_reg_data[username].password = POST['password'];
    user_reg_data[username].email = POST['email'];

    data = JSON.stringify(user_data);
    fs.writeFileSync(filename, data, "utf-8");
    response.send("User " + username + " logged in");

}

});

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
            response.redirect("./register.html?"+stringified); 
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
app.use(express.static('./public')); //Creates a static server using express from the public folder
app.listen(8080, () => console.log(`listen on port 8080`))