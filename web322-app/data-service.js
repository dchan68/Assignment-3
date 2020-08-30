var cars=[]
var people=[]
var stores=[]

//fs allows user to read or write files
var fs = require("fs");

//since server.js requires usage of this module, we have to export this particular function. Hence
//we use the module.export and assign it to this function.
module.exports.initialize=function(){
//fs.readFile will be done in sequence. readFile will read JSON files and will do
//either 2 things. If error occurs, it will do err. the data from each JSON will
//be parsed into each array I created. If error doesn't occur, it will do resolve().
    return new Promise (function(resolve, reject){
        fs.readFile('./data/cars.json', 'utf8', (err, data) => {      
            if (err) {
              reject(err); 
              return;
            }     
            cars=JSON.parse(data);
       
            fs.readFile("./data/people.json", "utf8", (err,data)=>{
                if (err){
                    reject({message: "unable to read file"});
                    return;
                }
                people=JSON.parse(data);

                    fs.readFile("./data/stores.json", "utf8", (err,data)=>{
                        if (err){
                            reject({message: "unable to read file"});
                            return;
                        }
                        stores=JSON.parse(data);
                        resolve({message: "successful"});                     
                    });
            });
        });
    });
}

//this function will be called if /people is requested. Basically determines the length of the array
//if array is somehow empty, a reject() will be issued and passed to server.js via module.export
//so error message can be sent
module.exports.getAllPeople=function(){
    return new Promise(function(resolve,reject){
        if(people.length===0){
            reject({message: "no results returned"});
        }
        resolve(people);
    })
}

module.exports.getCars=function(){
    return new Promise(function(resolve,reject){
        if (cars.length===0){
            reject({message: "no results returned"});
        }
        resolve(cars);
    })
}

module.exports.getStores=function(){
    return new Promise(function(resolve, reject){
        if (stores.lenght===0){
            reject({message: "no results returned"});
        }
        resolve(stores);
    })
}

//assignment 3 code begins
//part 3
module.exports.addPeople = function(peopleData){
    return new Promise(function(resolve, reject){
        peopleData.id = people.length + 1;
        people.push(peopleData);
        resolve();
    })
}

//part 5
module.exports.getPeopleByVin = function(vin){
    var peopleVin=[];
    return new Promise(function(resolve, reject){
        for (let i= 0; i < people.length; i++){
            if(vin == people[i].vin){
            peopleVin.push(people[i]);
            }
        }
        if (peopleVin.length===0){
            reject({message: "Vin not found"});
        }
        resolve(peopleVin);
    })
}

module.exports.getPeopleById= function(id){
    var peopleId=[];
    return new Promise(function(resolve, reject){
        for (let i= 0; i < people.length; i++){
            if(id == people[i].id){
            peopleId.push(people[i]);
            }
        }
        if (peopleId.length===0){
            reject({message: "ID not found"});
        }
        resolve(peopleId);
    })
}

module.exports.getCarsByVin= function(vin){
    var carVin=[];
    return new Promise(function(resolve, reject){
        for (let i= 0; i < cars.length; i++){
            if(vin == cars[i].vin){
            carVin.push(cars[i]);
            }
        }
        if (cars.length===0){
            reject({message: "ID not found"});
        }
        resolve(carVin);
    })
}

module.exports.getCarsByMake= function(make){
    var carMake=[];
    return new Promise(function(resolve, reject){
        for (let i= 0; i < cars.length; i++){
            if(make == cars[i].make){
            carMake.push(cars[i]);
            }
        }
        if (cars.length===0){
            reject({message: "ID not found"});
        }
        resolve(carMake);
    })
}

module.exports.getCarsByYear= function(year){
    var carYear=[];
    return new Promise(function(resolve, reject){
        for (let i= 0; i < cars.length; i++){
            if(year == cars[i].year){
            carYear.push(cars[i]);
            }
        }
        if (cars.length===0){
            reject({message: "ID not found"});
        }
        resolve(carYear);
    })
}


