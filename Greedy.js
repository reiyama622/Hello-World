var change = 6.99;
var dollars = 0;
var quarters = 0;
var dimes = 0;
var nickles = 0;
var pennies = 0;
while (change>= 1.00){
    change = change-1.00;
    dollars++;
}
while (change>= .25){
    change = change-.25;
    quarters++;
}while(change >= .10){
    change = change-.10;
    dimes++;
}while(change >= .05){
    change = change-.05;
    nickles++;
}while(change >= 0.01){
    change = change-.01;
    pennies++;
}
console.log(dollars + " dollars");
console.log(quarters + " quarters");
console.log (dimes + " dimes");
console.log (nickles + " nickles");
console.log (pennies + " pennies");
