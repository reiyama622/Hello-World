/* 
Used from Lab13
*/
var data = require('../Yamamoto_Rei_Assignment1/public/product_data.js'); //load products_data.js file and set to variable 'data'
var products = data.products; //set variable 'products' to the products array in the product_data.js file
var queryString = require('query-string'); //read variable 'queryString' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body parser module

//writes the requests in the console
app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

//from ex4 lab13
app.post("/process_form", function (request, response) {
        let POST = request.body; 
        
        if (typeof POST['checkOut'] != 'undefined') {
            var hasvalidquantities=true;
            var hasquantities=false;
            for (var i = 0; i < products.length; i++) {
                            var qty=POST[`quantity${i}`];
                            hasquantities=hasquantities || qty>0;
                            hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    
            } 
            const stringified = queryString.stringify(POST);
            if (hasvalidquantities && hasquantities) {
                response.redirect("./invoice.html?"+stringified); 
            }  
            else {response.send('You did not enter a valid quantity')} 
        }
    });
    
    //chacks for non neg instegers
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