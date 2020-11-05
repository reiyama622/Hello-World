/* 
Copied from info_server_Ex4.js from Lab13
Assignment 1: Server
*/
var products = require('./public/product_data.js'); //load services_data.js file and set to variable 'data'
var services_array = data.products; //set variable 'services_array' to the services_array in the services_data.js file
const queryString = require('qs'); //read variable 'queryString' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module

app.all('*', function (request, response, next) { //for all request methods...
    console.log(request.method + ' to ' + request.path); //write in the console the request method and its path
    next(); //move on
});

app.use(myParser.urlencoded({ extended: true })); //get data in the body

app.post("/process_form", function (request, response) {
        let POST = request.body; // data would be packaged in the body//
        if (typeof POST['submitPurchase'] != 'undefined') {
            var hasvalidquantities=true; // creating a varibale assuming that it'll be true// 
            var hasquantities=false;
            for (var i = 0; i < products.length; i++) {
                            var qty=POST[`quantity${i}`];
                            hasquantities=hasquantities || qty>0; // If it has a value bigger than 0 then it is good//
                            hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid//     
            } 
            // if all quantities are valid, generate the invoice// 
            const stringified = queryString.stringify(POST);
            if (hasvalidquantities && hasquantities) {
                response.redirect("./invoice.html?"+stringified); // using the invoice.html and all the data that is input//
            }  
            else {response.send('Enter a valid quantity!')} 
        }
    });
    
    //repeats the isNonNegInt function from the index.html file because there is no relation between the index.html page and server, so it needs to be redefined here for the server to process the form and know what to do if there is invalid data inputs in the quantity_textbox fields
    function isNonNegInt(q, returnErrors = false) {
       var errors = []; // assume that quantity data is valid 
        if (q == "") { q = 0; }
        if (Number(q) != q) errors.push('Not a number!'); //check if value is a number
        if (q < 0) errors.push('Negative value!'); //check if value is a positive number
        if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number
        return returnErrors ? errors : (errors.length == 0);
    }

    app.use(express.static('./public')); // root in the 'public' directory so that express will serve up files from here
app.listen(8080, () => console.log(`listening on port 8080`)); //run the server on port 8080 and write it in the console