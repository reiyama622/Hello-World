var ageCount = 1;
var age = 21;
while(ageCount < age){
    if(ageCount >= age/2){
        console.log("Im old!");
        break;
    }
    console.log(`age ${ageCount}`);
    ageCount++;
}
console.log(`Rei is ${ageCount} years old`);