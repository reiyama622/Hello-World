/* 
Used from Lab13
*/
//data from product_data in variable data
var data = require('../Yamamoto_Rei_Assignment1/public/product_data.js');
//set products to equal the products from the data variable
var products = data.products; 
//quert string into an object
var queryString = require('query-string'); 

var express = require('express'); 
var app = express(); 
var myParser = require("body-parser"); 

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
        if (q == "") { q = 0; }
        if (Number(q) != q) errors.push('Not a number!');
        if (q < 0) errors.push('Negative value!');
        if (parseInt(q) != q) errors.push('Not an integer!'); 
        return returnErrors ? errors : (errors.length == 0);
    }
    app.use(express.static('./public')); 
app.listen(8080, () => console.log(`listening on port 8080`)); 