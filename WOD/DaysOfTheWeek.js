var date = 22;
var month = "January";
var year = 2000;
// gets the last two digits of the year
var step1 = year % 100;
//divide the last two digits of the year and get the integer
var step2 = parseInt(step1/4);
var step3 = step1 + step2;
var step4;
var step8;
//if else to determine if the month is january or not
if(month == "January"){
    step8 = date+step3;
}
else{
    switch(month){
        case "February":
            step4 = 3;
            break;
        case "March":
            step4 = 3;
            break;
        case " April":
            step4 = 6;
            break;
        case "May":
            step4 = 1;
            break;
        case "June":
            step4 = 4;
            break;
        case "July":
            step4 = 6;
            break;
        case "August":
            step4 = 2;
            break;
        case "September":
            step4 = 5;
            break;
        case "October":
            step4 = 0;
            break;
        case "November":
            step4 = 3;
            break;
        case "December":
            step4 = 5;
            break;
    }
    var step6 = step3 + step4;
    step8 = date + step6;
}
var dayOfTheWeek;
//determines if it is a leap year or not
var isLeapYear;
isLeapYear = ((year % 4 == 0) && (year % 100 == 0) && (year % 400 ==0)) || ((year % 4 == 0) && (year % 100 > 0));
//determines if the year is 20 or 19
if((parseInt(year/100) == 19 ) && (isLeapYear == false)){
    dayOfTheWeek = step8 % 7;
}
else if ((parseInt(year/100) == 19 ) && (isLeapYear == true)){
    if(month == "January" || month == "February"){
        step8 = step8-1;
        dayOfTheWeek = step8 % 7;
    }
    else{
        dayOfTheWeek = step8 % 7;
    }
}
else if((parseInt(year/100) == 20 ) && (isLeapYear == false)){
    step8 = step8-1;
    dayOfTheWeek = step8 % 7;
}
else if ((parseInt(year/100) == 20 ) && (isLeapYear == true)){
    if(month == "January" || month == "February"){
        step8 = step8-2;
        dayOfTheWeek = step8 % 7;
    }
    else{
        step8 = step8-1;
        dayOfTheWeek = step8 % 7;
    }
}
var dow;
if(dayOfTheWeek == 0){
    dow = "sunday";
    console.log("You were born on a " + dow);
}
else if(dayOfTheWeek == 1){
    dow = "monday";
    console.log("You were born on a " + dow);
}
else if(dayOfTheWeek == 2){
    dow = "tuesday";
    console.log("You were born on a " + dow);
}
else if(dayOfTheWeek == 3){
    dow = "wednesday";
    console.log("You were born on a " + dow);
}
else if(dayOfTheWeek == 4){
    dow = "thursday";
    console.log("You were born on a " + dow);
}
else if(dayOfTheWeek == 5){
    dow = "friday";
    console.log("You were born on a " + dow);
}
else if(dayOfTheWeek == 6){
    dow = "saturday";
    console.log("You were born on a " + dow);
}
