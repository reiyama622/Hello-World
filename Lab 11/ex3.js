var name = "Rei";
var age = 21;
var attributes = name + ";" + age + ";" + (age + 0.5) + ";" + (0.5 - age);
var pieces = attributes.split(";");
for(var part of pieces){
    console.log(`${part} is a ${typeof part}`);
console.log(pieces.join(","));
}