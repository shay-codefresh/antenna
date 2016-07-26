var math = require('mathjs');
var fs = require("fs");
var _ = require('lodash-node');


function distance(x1, y1, x2, y2) {
    return math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2));
}
//sort the array according to the variable whichcell- the closest to the cellphone
//sort the array according to the largest transsmition length
function sortarray(array) {
    array = _.sortBy(array, function (value) {
        return -value.transmissionLength;
    })
    return array;
}

function phase1(filename, dot1, dot2, callback) {
//step 1 started
    var x1 = dot1.x;
    var y1 = dot1.y;
    var x2 = dot2.x;
    var y2 = dot2.y;

    fs.readFile(__dirname + '/' + filename, function (err, result) {
        console.log(__dirname + '/' + filename)
        if (err) {
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            //ann array with id and distance
            var antenna1 = [0, Number.MAX_VALUE];
            var antenna2 = [0, Number.MAX_VALUE];
            var antennas = JSON.parse(result).antennas;
            //var antennas = antennas.antennas;

            for (var i = 0; i < antennas.length; i++) {
                antennas[i].distance1 = distance(antennas[i].position.x, antennas[i].position.y, x1, y1);
                antennas[i].distance2 = distance(antennas[i].position.x, antennas[i].position.y, x2, y2);
                if (antennas[i].distance1 < antenna1[1]) {
                    antenna1[0] = antennas[i].id;
                    antenna1[1] = antennas[i].distance1;
                }
                if (antennas[i].distance2 < antenna2[1]) {
                    antenna2[0] = antennas[i].id;
                    antenna2[1] = antennas[i].distance2;
                }
            }
            //in case its the same antenna
            if (antenna1[0] === antenna2[0]) {
                callback(null, [antenna1[0]]);
                return;
            }
            else {
                var result = [antenna1[0], antenna2[0]];
                callback(null, result);
                return;
            }
        }
    });
}

function phase2(filename, dot1, dot2, callback) {
//take take the dot
    var x1 = dot1.x;
    var y1 = dot1.y;
    var x2 = dot2.x;
    var y2 = dot2.y;

    fs.readFile(__dirname + '/' + filename, function (err, result) {
        console.log(__dirname + '/' + filename)
        if (err) {
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            //ann array with id and distance
            var antennas = JSON.parse(result).antennas;
            //relevants antennas for cellphone 1
            var antennas1 = [];
            //relevants antennas for cellphone 2
            var antennas2 = [];
            for (var i = 0; i < antennas.length; i++) {
                antennas[i].distance1 = distance(antennas[i].position.x, antennas[i].position.y, x1, y1);
                antennas[i].distance2 = distance(antennas[i].position.x, antennas[i].position.y, x2, y2);

                //*** add line about the checking if it is the same one

                //in case its the same antenna**
                if (antennas[i].distance1 <= antennas[i].transmissionLength && antennas[i].distance2 <= antennas[i].transmissionLength) {
                    callback(null, [antennas[i].id]);
                    return;
                }
//enters only the relevants antennas for each cellphone
                if (antennas[i].distance1 <= antennas[i].transmissionLength)
                {
                    antennas1.push(antennas[i]);
                }
                if (antennas[i].distance2 <= antennas[i].transmissionLength)
                {
                    antennas2.push(antennas[i]);
                }
            }
            if (antennas2.length == 0 || antennas1.length == 0) {
//if one of the cellphone dont have relavant antenna
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }
            else {
                //antennas1 = sortarray(antennas1);
                //antennas2 = sortarray(antennas2);
                for (var i = 0; i < antennas1.length; i++) {
                    for (var j = 0; j < antennas2.length; j++) {
//not the same antenna and the sum of transmissionLengths is bigger than the distance between them
                        if (antennas1[i].id != antennas2[j].id && antennas1[i].transmissionLength + antennas2[j].transmissionLength >= distance(antennas1[i].position.x, antennas1[i].position.y, antennas2[j].position.x, antennas2[j].position.y)) {
                            callback(null, [antennas1[i].id, antennas2[j].id]);
                            return;
                        }
                    }
                }
//nothing found
//                throw new Error("no antennas in range");
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }
        }
    });
}


function phase3333(filename, dot1, dot2, callback) {
//take take the dot
    var x1 = dot1.x;
    var y1 = dot1.y;
    var x2 = dot2.x;
    var y2 = dot2.y;
//read the file
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        console.log(__dirname + '/' + filename)
        if (err) {
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            //ann array with id and distance
            var antennas = JSON.parse(result).antennas;
            //add distances from dot 1 and dot 2
            for (var i = 0; i < antennas.length; i++) {
                antennas[i].distance1 = distance(antennas[i].position.x, antennas[i].position.y, x1, y1);
                antennas[i].distance2 = distance(antennas[i].position.x, antennas[i].position.y, x2, y2);
                //in case its the same antenna
                if (antennas[i].distance1 <= antennas[i].transmissionLength && antennas[i].distance2 <= antennas[i].transmissionLength) {
                    //one antenna reach for both cellphones
                    callback(null, [antennas[i].id]);
                    return;
                }
            }


            var minroute = [];
            for (var i = 0; i < antennas.length; i++) {
                //*if its not nothing
                var thisroute = "";
                if (antennas[i].distance1 <= antennas[i].transmissionLength) {
                    var temp = route(antennas, x2, y2, i, 0, thisroute);
                    //*check if temp is smaller than temp

                    if (temp != "") {
                        if (temp.indexOf(',') > -1) {
                            temp = temp.split(',');
                        }
                        else {
                            temp = [temp];
                        }
                        //initialize min route
                        if (minroute.length == 0) {
                            minroute = temp;
                        }
                        //new smallest route
                        if (temp.length < minroute.length) {
                            minroute = temp;
                        }
                    }

                }

            }
            callback(null, minroute);
        }
    });
}


//array,dot2,index,routelength, **returns the path
function route(array, x, y, i, j, routes) {
//check if its the same one V
//check if you are inside the array limits V
    var result = "";
    if (routes.indexOf(array[i].id) > -1) {
        routes = "";
        return "";
    }

    if (array[i].transmissionLength >= distance(x, y, array[i].position.x, array[i].position.y)) {
        routes += array[i].id;
        return result + array[i].id;
    }
    if (i != j) {
        if (array[i].transmissionLength + array[j].transmissionLength >= distance(array[i].position.x, array[i].position.y, array[j].position.x, array[j].position.y)) {

            //if resultcontains does not contains j
            if (routes.indexOf(array[j].id) <= -1) {
                //I need to check if it might return backwards
                var temp = route(array, x, y, j, 0, routes);
                if (temp != "") {
                    routes += "," + array[j].id + temp;
                    return result + "," + array[j].id + "," + temp;
                }


            }
        }
    }
    if (j + 1 < array.length) {
        if (routes.indexOf(array[j + 1].id) > -1)
            return "";
        var temp = route(array, x, y, i, j + 1, routes);
        if (temp != "") {
            routes += "," + array[j + 1].id + temp;
            return result + "," + array[j + 1].id + "," + temp;
        }
    }
    return "";
}

var minpath = Number.MAX_VALUE;
var minpathvar = [];
//to convert to ids array

function path(dot1, dot2, array, result) {
    if (dot1.transmissionLength == undefined && dot2.transmissionLength == undefined) {
    //if (dot1.isNull("transmissionLength")  && !dot2.isNull("transmissionLength")) {
        //case both dots in range of the same antenna
        var newtemp= inrange(dot1, array);
        var rangevar = inrange(dot2,newtemp);

        //var rangevar = inrange(dot2, inrange(dot1, array));
        if (rangevar != 0) {
            if (rangevar.length < minpath) {
                minpathvar = [rangevar[0]];
                minpath = minpathvar.length;
            }
            return;
        }
    }
    var rangevar = inrange(dot2, array);
    if (result.length > 0 && rangevar.length > 0) {
        //check if i need to add the object
        result.push(rangevar[0]);
        if (rangevar.length < minpath) {
            minpathvar = result;
            minpath = result.length;
        }
        return;
    }
//breackpoint.got to the other point.non in range.
    rangevar = inrange(dot1, array);
    if (rangevar.length != 0) {
        for (var i = 0; i < rangevar.length; i++) {
            //console.log(result);
            //if its the first var
            var temp=_.reject(array,function (el){return el.id==rangevar[i].id});
            if(result==[]){
                path(rangevar[i], dot2, temp,[rangevar[i]])
            }
            else {
                result.push(rangevar[i]);
            }

         //   path(rangevar[i], dot2, array.splice(i, 1), temp);
            path(rangevar[i], dot2, temp,result)
        }
    }
    return;
}
//gets a dot and and array and return an array of antennas that are in the range of the dot
function inrange(dot, array) {
    var results = [];
    //if its a dot
    if (dot.transmissionLength == undefined) {
   // if (dot.isNull("transmissionLength")) {
        for (var i = 0; i < array.length; i++) {
            var tempy=distance(array[i].position.x, array[i].position.y, dot.x, dot.y);
            if (array[i].transmissionLength >= tempy) {
                results.push(array[i]);
            }
        }
    }
//if its an antenna
    else {
        for (var i = 0; i < array.length; i++) {
            if (array[i].transmissionLength + dot.transmissionLength >= distance(array[i].position.x, array[i].position.y, dot.position.x, dot.position.y)) {
                results.push(array[i]);
            }
        }
    }

    return results
}


module.exports.path = path;
module.exports.route = route;
module.exports.phase1 = phase1;
module.exports.phase2 = phase2;
module.exports.phase3 = phase3;
module.exports.distance = distance;


function phase3(filename, dot1, dot2, callback) {
//take take the dot
    var x1 = dot1.x;
    var y1 = dot1.y;
    var x2 = dot2.x;
    var y2 = dot2.y;
//read the file
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        console.log(__dirname + '/' + filename)
        if (err) {
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            //ann array with id and distance
            var antennas = JSON.parse(result).antennas;
            var history = [];
            path(dot1, dot2, antennas, history);
            var answer=[];
            for(var i=0;i<minpathvar.length;i++){
                answer.push(minpathvar[i].id);
            }
            callback(null, answer);
        }
    });
}


///things i need to do : order,check the undefind thing,check splica and correct it !!!!!, understand what the story about push