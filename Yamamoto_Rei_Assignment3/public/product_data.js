var red =[
  {  
  "product":"Apples",  
  "price": 1.32,  
  "image": "./Images/apple.jpg"
  },
  {  
    "product":"Strawberries",  
    "price": 2.40,  
    "image": "./Images/strawberry.jpeg"
    },
    {  
    "product":"Watermelons",  
    "price": 0.33,  
    "image": "./Images/watermelon.jpeg"
    }]
var yellow=[
  {  
  "product":"Bananas",  
  "price": 0.57,  
  "image": "./Images/banana.jpg"
  },
  {  
    "product":"Pineapples",  
    "price": 4.28,  
    "image": "./Images/pineapple.jpeg"
    }]
    var orange = [
  {  
  "product":"Mangos",  
  "price": 4.20,  
  "image": "./Images/mango.jpg"
  },
  {  
  "product":"Oranges",  
  "price": 1.33,  
  "image": "./Images/orange.jpg"
  }]
  var purple=[
  {  
    "product":"Grapes",  
    "price": 2.03,  
    "image": "./Images/Grapes.jpg"
    }]
    var products = {
      "red": red , 
      "yellow": yellow,
       "orange": orange,
       "purple": purple

  }
  if (typeof module != 'undefined') {
      module.exports.products = products;
    }