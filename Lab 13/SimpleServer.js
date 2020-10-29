 //written by someone else to node. Built in (don't have to install) Loading Http in to assign it to the variable. 
var http = require('http');

//Creates a function server_callback()
//req=request,Contain all information the person is giving
//res=response, connection in how you can talk back to the request
function server_callback(req, res) {
    console.log(req.headers); //output the request headers to the console
    res.writeHead(200, { 'Content-Type': 'text/html' }); // set MIME type to HTML 
    res.write(`<h1>The server date is: ${Date.now()}</h1>`); //send a response to the client //server side processing
    res.write('<h1>The client date is: <script>document.write( Date.now() );</script></h1>'); // send another response //client side processing
    res.end(); //end the response
}
//create a server object: that contains the function server_callback()
 //the server object listens on port 8080 ()in the parenthesis is the host name. If you don't give it a host it will go to localhost
http.createServer(server_callback).listen(8080);


console.log('Hello world HTTP server listening on localhost port 8080');
