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
    },
    {  
      "product":"Cherries",  
      "price": 0.63,  
      "image": "./Images/cherries.jpeg"
      }
  ]
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
    },
    {  
      "product":"Lemons",  
      "price": 1.23,  
      "image": "./Images/lemons.jpg"
      },
      {  
        "product":"Starfruits",  
        "price": 1.10,  
        "image": "./Images/starfruit.jpeg"
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
  },
  {  
    "product":"Peaches",  
    "price": 1.00  ,
    "image": "./Images/peaches.jpeg"
    },
    {  
      "product":"Apricots",  
      "price": 2.00,  
      "image": "./Images/apricot.jpeg"
      }
  ]
  var purple=[
  {  
    "product":"Grapes",  
    "price": 2.03,  
    "image": "./Images/Grapes.jpg"
    },
    {  
      "product":"Blueberries",  
      "price": 0.25,  
      "image": "./Images/blue berries.jpeg"
      },
      {  
        "product":"Figs",  
        "price": 1.15,  
        "image": "./Images/fig.jpeg"
        },
        {  
          "product":"Black Berries",  
          "price": 0.67,  
          "image": "./Images/black berries.jpeg"
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