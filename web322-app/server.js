/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students. 
*
*Name: Daryan Chan Student ID: 113973182 Date: 1//2020
*
*Online (Heroku) Link: https://fathomless-sierra-53317.herokuapp.com/ 
*
********************************************************************************/ 

//This code is like a header for C++. Used so that path.join feature can be used
//in line 40
var path = require("path");

//assignment 3 requirement
var multer = require("multer");

//basically like header file for C++. required to connect to data-service.js module 
//so that code from that file can be used be used here
var dataService = require('./data-service')

//allows us to use get. ex app.get in line 36
var express = require("express");
var app = express();

//assignment 3 part 2
const storage = multer.diskStorage({
  destination: "./public/pictures/uploaded",
  filename: function (req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname));   //check the notes for correct usage
  }
});

const upload = multer({ storage: storage }); //assignment 3 part 2 ends here


//This code is basically to connect to heroku
var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//note to self: app.use(express.static('public')) will be explained week 4
app.use(express.static('public')); 
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
  res.sendFile(path.join(__dirname,"/views/home.html"))
});

// setup another route to listen on /about. File sends html page to the localport
app.get("/about", function(req,res){
  res.sendFile(path.join(__dirname,"/views/about.html"))
});

//If the /people is requested, this function will be called. dataService refers back to data-service.js module
//and utilize the getAllPeople() function from data-service.js module
app.get("/people", function(req,res){

  //assignment 3, part 4 updating /people route
  if (req.query.vin){
    dataService.getPeopleByVin(req.query.vin) //query is used if user enters /people?vin=value
    .then((data)=>{
      res.json(data);
    })
    .catch(err=>{
      res.json(err);
    })
  }
  else{
    dataService.getAllPeople()
    .then((data)=>{
      res.json(data);
    })
    .catch(err=>{
      res.json(err);
    })
  }


});


 
//If the /cars is requested, this function will be called. dataService refers back to data-service.js module
//and utilize the getCars() function from data-service.js module
app.get("/cars", function(req,res){
  if (req.query.vin){  //query used for if user enters /cars?vin=value, where value is equal to a certain vin
    dataService.getCarsByVin(req.query.vin)
    .then((data)=>{
      res.json(data);
    })
    .catch(err=>{
      res.json(err);
    })
  }
  else if (req.query.make){
    dataService.getCarsByMake(req.query.make)
    .then((data)=>{
      res.json(data);
    })
    .catch(err=>{
      res.json(err);
    })
  }
  else if (req.query.year){
    dataService.getCarsByYear(req.query.year)
    .then((data)=>{
      res.json(data);
    })
    .catch(err=>{
      res.json(err);
    })
  }
  else{
  dataService.getCars()
  .then((data)=>{
    res.json(data);
  })
  .catch(err=>{
    res.json(err);
  })
}
});

//If the /stores is requested, this function will be called. dataService refers back to data-service.js module
//and utilize the getStores() function from data-service.js module
app.get("/stores", function(req,res){
  dataService.getStores()
  .then((data)=>{
    res.json(data);
  })
  .catch(err=>{
    res.json(err);
  })
});

//Assignment 3
//New code for assignment 3 added here
//Part 1
app.get("/people/add", function(req, res){
  res.sendFile(path.join(__dirname, "/views/addPeople.html"))
});

app.get("/pictures/add", function(req, res){
  res.sendFile(path.join(__dirname, "/views/addImage.html"))
});

//part 2 continues here from the top
app.post("/pictures/add", upload.single("pictureFile"), (req, res) => {
  res.redirect("/pictures");
});

var fs = require("fs");

app.get("/pictures", function(req, res){
 fs.readdir('./public/pictures/uploaded', 'utf8', (err, data) => {   
   var array = {images: []};   
   for (var i = 0; i < data.length; i++){
     array.images.push(data[i]);
   }
   res.json(array);
  });   
});

//Part 3
//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
const bodyParser =  require ("body-parser");

app.use(bodyParser.urlencoded({ extended: true }))
 
//adding route to make a call to addPeople function from data-service.js 
app.post("/people/add", (req, res) => {
  //.then is used because promised is used. If promise is resolved (ex: resolve()), the parameter within resolve() will be 
  //passed to .then().
   dataService.addPeople(req.body).then(()=>{
     res.redirect('/people');
    });
});

//Part 4 is near the top of assignment and below

app.get("/person/:value", function(req,res){
  dataService.getPeopleById(req.params.value) //params is used if user enters /people/value
  .then((data)=>{
    res.json(data);
  })
  .catch(err=>{
    res.json(err);
  })
})

//assignment 3 code ends here

//this * means everything. If requested file isn't found, this function will
//display an error
app.get('*', function(req, res) {  
  res.send('<h3>page not found<h3>');
});
// setup http server to listen on HTTP_PORT and then calls onHTTpStart once connection
//has been made

dataService.initialize()
.then(()=>{
  app.listen(HTTP_PORT, onHttpStart);
})
.catch(err=>{
  console.log(err);
})

