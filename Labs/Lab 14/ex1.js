
var express = require('express');
var app = express();
var myParser = require("body-parser");

const fs = require('fs');

const user_data_filename = 'user_data.json'

//checks if the file exists before reading it
if(fs.existsSync(user_data_filename)){
    //gets the stats of the user_data_filename variable.
    var stats= fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats['size']} characters.`);
   
    //reads the file an puts the data into variable 'data'
    var data = fs.readFileSync(user_data_filename, 'utf-8');
    // parses the JSON data into a variable 'user_reg_data'
    var user_reg_data = JSON.parse(data);
    
}

//console.log(data, typeof users_reg_data, typeof data);

//logs the value of password in the user_reg_data json file.
//console.log(user_reg_data['dport']['password'])

app.use(myParser.urlencoded({ extended: true }));

app.get("login", function (request, response) {
    // Give a simple login form
    var str = `
<body>
<form action="process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

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

app.listen(8080, () => console.log(`listening on port 8080`));


