/*this function checks to see if stringChecking is a non negative integer
returns true if it is a non negative integer and returns errors if not*/
function isNonNegInt(stringChecking,returnErrors=false){
    var errors = []; // assume no errors at first
    if(Number(stringChecking) != stringChecking) errors.push('Not a number!'); // Check if string is a number value
    if(stringChecking < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(stringChecking) != stringChecking) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}
var attributes = "Rei;21;21.5"+(0.5 - 21);
var pieces = attributes.split(";");
function callBack(part,i){
    console.log(`${part} is non neg int ${isNonNegInt(pieces[part],true).join("*** ")}`);
}
pieces.forEach(callBack);
//console.log(isNonNegInt("5"));
