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
        //console.log(__dirname + '/' + filename)
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
//take the dot
    var x1 = dot1.x;
    var y1 = dot1.y;
    var x2 = dot2.x;
    var y2 = dot2.y;

    fs.readFile(__dirname + '/' + filename, function (err, result) {
        //console.log(__dirname + '/' + filename)
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
                if (antennas[i].distance1 <= antennas[i].transmissionLength) {
                    antennas1.push(antennas[i]);
                }
                if (antennas[i].distance2 <= antennas[i].transmissionLength) {
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
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }
        }
    });
}

var minpath = Number.MAX_VALUE;
var minpathvar = [];
//to convert to ids array

function path(dot1, dot2, array, result) {
    //checks if theres mutual antennas
    var rangevar = inrange(dot2, inrange(dot1, array));
    if (rangevar != 0) {
        if (dot1.transmissionLength == undefined && dot2.transmissionLength == undefined) {
            //first case ,both dots in range of the same antenna. return the first
            if (rangevar.length < minpath) {
                minpathvar = [rangevar[0]];
                minpath = minpathvar.length;
            }
        }
        else {
            //dot2 is in range of the antennas
            result.push(rangevar[0]);
            if (rangevar.length < minpath) {
                minpathvar = result;
                minpath = result.length;
            }
        }
        return;
    }
//for each neighbor as dot 1 check path
    rangevar = inrange(dot1, array);
    if (rangevar.length != 0) {
        for (var i = 0; i < rangevar.length; i++) {
            //do not repeat this point
            var notrepeat = _.reject(array, function (el) {
                return el.id == rangevar[i].id
            });
            //if its the first time running result is empty
            if (result == []) {
                path(rangevar[i], dot2, notrepeat, [rangevar[i]])
            }
            else {
                result.push(rangevar[i]);
            }
            path(rangevar[i], dot2, notrepeat, result);
        }
    }
    return;
}
//gets a dot and and array and return an array of antennas that are in the range of the dot
function inrange(dot, array) {
    var results = [];
    //if its a dot
    if (dot.transmissionLength == undefined) {
        for (var i = 0; i < array.length; i++) {

            if (array[i].transmissionLength >= distance(array[i].position.x, array[i].position.y, dot.x, dot.y)) {
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


function phase3(filename, dot1, dot2, callback) {
// take the dot
    var x1 = dot1.x;
    var y1 = dot1.y;
    var x2 = dot2.x;
    var y2 = dot2.y;
//read the file
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        //console.log(__dirname + '/' + filename)
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

            if (minpathvar.length == 0) {
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }
            var answer = [];
            for (var i = 0; i < minpathvar.length; i++) {
                answer.push(minpathvar[i].id);
            }
            callback(null, answer);
        }
    });
}


///things i need to do : order,check the undefind thing,check splica and correct it !!!!!, understand what the story about push
//max value.how to run on minpath. ugly length

module.exports.path = path;
module.exports.phase1 = phase1;
module.exports.phase2 = phase2;
module.exports.phase3 = phase3;
module.exports.phase4 = phase4;
module.exports.distance = distance;


var dict = {}

function phase4(filename, dot1, dot2, callback) {
// take the dot
    var x1 = dot1.x;
    var y1 = dot1.y;
    var x2 = dot2.x;
    var y2 = dot2.y;
//read the file
    //how many pointsdont have paths
    var pointsdonthavepaths = 1;
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        //console.log(__dirname + '/' + filename)
        if (err) {
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            //var dict={}
            //ann array with id and distance
            var antennas = JSON.parse(result).antennas;
            var annbck = antennas;
            //var paths=[dot1];

            //correctit
            for (var i = 0; i < antennas.length; i++) {

                dict.position = antennas[i];
                // dict[position].visited=false;
                pointsdonthavepaths++;
                //distance from dot1=max value

            }
            //antennas.unshift(dot)
            antennas.push(dot2);
            dict.dot1 = dot1;
            dict.dot2 = dot2;
            dict.dot1.visited = true;
            dict.dot2.visited = false;

            var history = [];
            var currentdot = dot1;
            var history = dot1;
            var mindistance = Number.MAX_VALUE;
            while (pointsdonthavepaths != 0 && dict.dot2.path == undefined) {
                //for (var i = 0; i < antennas.length; i++) {
                mindistance = Number.MAX_VALUE;
                var index = 0;
                var rangevar = inrange(currentdot, antennas);
                while (antennas.length > 0 && i < antennas.length) {

                    if (rangevar.length != 0) {
                        for (var j = 0; j < rangevar.length; j++) {
                            //if(distance<mindist)
                            //minditance = distance
                            //save history for object
                            //save path in history var + sum of the distance
                            //take object out of antennas
                            //has history=visited if x.pah!=undifeund
                            //pointsdonthavepaths--
                        }
                    }
                    else {
                        //if no there is no way
                        //take out this neigber
                        //cur==last
                        currentdot =
                            index++;
                    }
                    //if no nighbers.
                    //cur
                }
            }
        }
    });
}


//function recpath(){

//distance from dot 1 in infinity for all
//hold minimum=infinity
//for vertex check its niegbers
//if nightbers.length ==0 return;
// for each nightber calculate distance from vertex
//check if history+nighbers < history for this point
// if minimum > distance
//minimum =distance
//if its minimum has minimum ==true
//history+ nighber
//  nighbers recpath(history + vertex,history,vertex,dot2,array-vertex
//
//way until here pass in sign . new vertex ,no nighbers return 0


//organize this place
var min;
min.history=[]
function recpath(vertex, history, endpoint, array) {
    //distance from dot 1 in infinity for all
    min.val = Number.MAX_VALUE;
    if (vertex==endpoint){
        return;
    }
    var neighbors = inrange(vertex, array);
    if (neighbors.length == 0) {
        return
    }
    //got to endpoint
    for (var i = 0; i < neighbors.length; i++) {
        var distance = distance(neighbors[i].position.x, neighbors[i].position.y, vertex.x2, vertex.y2);
        //in case its the minimum
        if (distance < min.val) {
            min.index = i;
            //what to do about returning on objects
        }

    }
        if (neighbors[i].position == endpoint) {
            dict[neighbors[i]].history = history;
        }
        else {
            dict[neighbors[i]].history = history.push(neighbors[min.i]);
        }
        var notrepeat = _.reject(array, function (el) {
            return el.id == neighbors[i].id
        });
        recpath(neighbors[i], history.push(neighbors[i]), endpoint, notrepeat);
    }
    //dict[neighbors[min.i]].isminimum = true;


function newrecpath(vertex, history, endpoint, array) {
    min.val = Number.MAX_VALUE;
    if (vertex==endpoint){
        return history;
    }

    var neighbors = inrange(vertex, array);
    if (neighbors.length == 0) {
        //correct this line
        recpath(history[history.length-1], history-vertex, endpoint, array-vertex);
    }

    for (var i = 0; i < neighbors.length; i++) {
        var distance = distance(neighbors[i].position.x, neighbors[i].position.y, vertex.x2, vertex.y2);
        if (distance < min.val) {
            min.index = i;
            //what to do about returning on objects
        }
    }
    //check if all the way is minimum way
    //enter to history
    recpath(curr, history+curr, endpoint, array-curr);
}

// if minimum > distance
//minimum =distance
//if its minimum has minimum ==true
//history+ nighber
//  nighbers recpath(history + vertex,history,vertex,dot2,array-vertex
//****think of a way to continue running , maybe to take down of the array
//way until here pass in signature . new vertex ,no nighbers return 0
//check if dot2 in neigbors if got to dot 2
//return
    // if minimum > distance
    //minimum =distance
    //if its minimum has minimum ==true
    //history+ nighber
    //  nighbers recpath(history + vertex,history,vertex,dot2,array-vertex
    //****think of a way to continue running , maybe to take down of the array
    //way until here pass in signature . new vertex ,no nighbers return 0
    //check if dot2 in neigbors if got to dot 2
    //return


function sumhistory(array) {
    var sum=0;
    if(array==[]){
        return 0;
    }
    for(var i = 0; i < array.length; i++){
        sum+=array[i].distance();
    }
    return sum;
}


function recpathGOODPOINT(vertex, history, endpoint, array) {
    //distance from dot 1 in infinity for all
    if (vertex==endpoint){
        return;
    }
    var neighbors = inrange(vertex, array);
    if (neighbors.length == 0) {
        return
    }
    //got to endpoint

    for (var i = 0; i < neighbors.length; i++) {
        var distance = distance(neighbors[i].position.x, neighbors[i].position.y, vertex.x2, vertex.y2);

        //in case its the minimum
        if (sumhistory(dict[neighbors[i]].history) > sumhistory(history)+distance) {
            //the fastest way to get to that point
            if(neighbors[i].position==endpoint){
                dict[neighbors[i]].history =history;
            }
            else{
                dict[neighbors[i]].history = history.push(neighbors[min.i]);
            }
            var notrepeat = _.reject(array, function (el) {
                return el.id == neighbors[i].id
            });
            //minus vertex minus this nighbor
        }
        recpath(neighbors[i], history.push(neighbors[i]), endpoint, notrepeat);
    }

}