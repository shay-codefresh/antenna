var math = require('mathjs');
var fs = require("fs");
var _ = require('lodash-node');

//todo: change this to opts
// function(opts){
//     return math.sqrt(math.pow(opts.x2 - opts.x1, 2) + math.pow(opts.y2 - opts.y1, 2));
// }
function distance(x1, y1, x2, y2) {
    //TODO tr is not minus. if it is send error
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

function phase1(filename, point1, point2, callback) {
//step 1 started
    var x1 = point1.x;
    var y1 = point1.y;
    var x2 = point2.x;
    var y2 = point2.y;

    fs.readFile(__dirname + '/' + filename, function (err, result) {
        //console.log(__dirname + '/' + filename)

        // if (!err) {
        //     //all code
        // }
        // return

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
                // var opts = {
                //     x1: antennas[i].position.x,
                //     y1: antennas[i].position.y,
                //
                // }
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

function phase2(filename, point1, point2, callback) {
//take the point
    var x1 = point1.x;
    var y1 = point1.y;
    var x2 = point2.x;
    var y2 = point2.y;

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

//var minpath = Number.MAX_VALUE;
var minroute = [];
//to convert to ids array

//move to neigber antenna in range until it gets to point 2
function findroute(startpoint, endpoint, antennasarray, antennaroute) {
    //checks if theres mutual antennas
    var antennasinrange = validantennasinrange(startpoint, antennasarray);
    if (antennasinrange.length == 0) {
        return;
    }
    var mutualantennasinrange = validantennasinrange(endpoint, antennasinrange);
    //case there are antenna in range of startpoint and endpoint
    if (mutualantennasinrange.length != 0) {
        //TODO: maybe change here(!startpoint.transmissionLength && !endpoint.transmissionLength)
        //TODO endpoint.transmissionLength == undefined before calling the function
        //case start point is not antenna-cellphone
        if (antennaroute == []) {
            //case both point are cellphone and they have mutual antennas
            antennaroute = [mutualantennasinrange[0]];
        }
        else {
            antennaroute.push(mutualantennasinrange[0]);
        }
        //TODO:check if you can run this line before checking the case of no items in array
        if (minroute == [] || mutualantennasinrange.length < minroute.length) {
            minroute = antennaroute;
        }
        return;
    }
    //case we didnt get to point 2
    for (var i = 0; i < antennasinrange.length; i++) {
        //do not repeat this point
        var notrepeatedantennas = _.reject(antennasarray, function (el) {
            return el.id == antennasinrange[i].id
        });
        //if its the first time running antennaroute is empty
        if (antennaroute == []) {
            antennaroute=[antennasinrange[i]];
        }
        else {
            antennaroute.push(antennasinrange[i]);
        }
        //recursive call for next step . from antennasinrange[i] as start point
        findroute(antennasinrange[i], endpoint, notrepeatedantennas, antennaroute);
    }

    // todo: no need for this return;
}
//gets a point and and array and return an array of antennas that are in the range of the point
function validantennasinrange(point, array) {
    var results = [];
    //if its a point
    if (point.transmissionLength == undefined) {
        for (var i = 0; i < array.length; i++) {

            if (array[i].transmissionLength >= distance(array[i].position.x, array[i].position.y, point.x, point.y)) {
                results.push(array[i]);
            }
        }
    }
//if its an antenna
    else {
        for (var i = 0; i < array.length; i++) {
            if (array[i].transmissionLength + point.transmissionLength >= distance(array[i].position.x, array[i].position.y, point.position.x, point.position.y)) {
                results.push(array[i]);
            }
        }
    }
    return results;
}

function phase3(filename, point1, point2, callback) {
// take the point
    var x1 = point1.x;
    var y1 = point1.y;
    var x2 = point2.x;
    var y2 = point2.y;
//read the file
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        //console.log(__dirname + '/' + filename)
        if (err) { //todo: change to !err ...
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            //ann array with id and distance
            var antennas = JSON.parse(result).antennas;
            var history = [];

            //TODO if startpoint=endpoint || one of them is undefind
            findroute(point1, point2, antennas, history);

            if (minroute.length == 0) {
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }
            var answer = [];
            for (var i = 0; i < minroute.length; i++) {
                answer.push(minroute[i].id);
            }
            callback(null, answer);
        }
    });
}

var dict = {};

function phase4(filename, point1, point2, callback) {
// take the point
    var x1 = point1.x;
    var y1 = point1.y;
    var x2 = point2.x;
    var y2 = point2.y;
//read the file
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        //console.log(__dirname + '/' + filename)
        if (err) { //todo: change !err
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            var antennas = JSON.parse(result).antennas;
            //initialzie dictionary
            //if same antenna return
            var answer=[];
            if(point1.x === point2.x && point1.y === point2.y){
                answer=validantennasinrange(point1,antennas); //maybe change to let.. OR define the variable only in 1 place
                if(answer.length!==0){
                    callback(null, [answer[0].id]);
                    return;
                }
                else {
                    var error = new Error("no antennas in range");
                    callback(error);
                    return;
                }
            }

            for (var i = 0; i < antennas.length; i++) {
                // antennas[i].history=[];
                //dict[antennas[i].position.toString()] = antennas[i];
                //dict.push({antennas[i].position :antennas[i]});
                dict[antennas[i].id] = antennas[i];
                //console.log(antennas[i].position.toString())
            }

            //antennas.unshift(point)
            dict[-1]= point1;
            dict[-2]= point2;
            point2.history=[];
            point2={
                "id": "-2",
                "position": {
                    "x": point2.x,
                    "y": point2.y
                },
                "transmissionLength": 0
            };

            antennas.push(point2);
            var history=[];
            recpath(point1, history, point2, antennas);

            var resultpath=dict[point2.id].history;

            if (resultpath.length!=0){
                for (var i = 0; i < resultpath.length; i++) {
                    answer.push(resultpath[i].id);
                    //console.log(answer);
                }
                callback(null, answer);
                return;
            }
            else {
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }

        }
    });
}

function sumhistory(array) {
    var sum=0;
    if(array.length === 0){
        return 0;
    }
    for(var i = 0; i < array.length; i++){
        sum+=array[i].mydistance;
    }
    return sum;
}

//todo: change to opts object

function recpath(vertex, history, endpoint, array) {
    //distance from point 1 in infinity for all
    if (vertex == endpoint) {
        dict[endpoint.id].history = history;
        return;
    }
    if(vertex.position!=undefined){
        if(vertex.position.x==endpoint.x&&vertex.position.y==endpoint.y){
            return;
        }
    }

    var neighbors = validantennasinrange(vertex, array);
    if (neighbors.length == 0) {
        return;
    }
    //got to endpoint

    for (var i = 0; i < neighbors.length; i++) {
        // todo: change to opts for distance
        var mydistance = distance(neighbors[i].position.x, neighbors[i].position.y, vertex.x, vertex.y);
        //the fastest way to get to that point
        if(dict[neighbors[i].id].history==undefined) {

            history=addtohistory(neighbors[i], history, vertex);

            dict[neighbors[i].id].history = history;
        }
        else if (sumhistory(dict[neighbors[i].id].history) > sumhistory(history) + mydistance) {
            //if on of the nigh
            //check it
            // if (validantennasinrange(endpoint, [neighbors[i]]) != 0) {
            //     //I didnt calculate the distance between them .
            //     //leave it this way
            //     dict[neighbors[i]].history = history;
            // }
            history=addtohistory(neighbors[i], history, vertex);
            dict[neighbors[i].id].history = history;

        }
        else {
            history=addtohistory(neighbors[i], history, vertex);
        }
        var notrepeat = _.reject(array, function (el) {
            return el.id == neighbors[i].id });

        if(neighbors[i]!=endpoint) {
            recpath(neighbors[i], history, endpoint, notrepeat);
        }

    }

}

function addtohistory(antenna, history,vertex) {
    if (history.length == 0) {
        //add distance
        history = [antenna];
        history[0].mydistance = distance(antenna.position.x,antenna.position.y, vertex.x, vertex.y);
    }
    else {
        history.push(antenna);
        history[history.length - 1].mydistance = distance(antenna.position.x, antenna.position.y, history[history.length - 2].position.x, history[history.length - 2].position.y);
    }
    return history;
}

module.exports.phase1 = phase1;
module.exports.phase2 = phase2;
module.exports.phase3 = phase3;
module.exports.phase4 = phase4;
module.exports.phase5 = phase5;



function phase5(filename, point1, point2, callback) {
// take the point
    var x1 = point1.x;
    var y1 = point1.y;
    var x2 = point2.x;
    var y2 = point2.y;
//read the file
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        //console.log(__dirname + '/' + filename)
        if (err) { //todo: change !err
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            var antennas = JSON.parse(result).antennas;
            //initialzie dictionary
            //if same antenna return
            var answer=[];
            if(point1.x === point2.x && point1.y === point2.y){
                answer=validantennasinrange(point1,antennas); //maybe change to let.. OR define the variable only in 1 place
                if(answer.length!==0){
                    callback(null, [answer[0].id]);
                    return;
                }
                else {
                    var error = new Error("no antennas in range");
                    callback(error);
                    return;
                }
            }

            antennas.push(point1);
            antennas.push(point2);

            for (var i = 0; i < antennas.length; i++) {
                antennas[i].d=Number.MAX_VALUE;
                antennas[i].parent.id=null;
                //change all parent place so they include id
                antennas[i].index=i;
                antennas[i].isvisited=false;
            }
            point1.d=0;
            point1.parent=antennas.length-2;
            //point1.parent=point1;


            //read the file
    //add startpoint and endpoint,endpoint and  all antennas get infinity,startpoint dont

    //make a new array with properties : parent , d, isvisited ,index
    //call the function
    var route=[];
    routeatob(startpoint,endpoint,antennas,route);
    //caculate best route from a to

    //check if no nighbers
}



//TODO dont write the same code twice
function isnieghber(point1, point2) {
    if (point1.transmissionLength + point2.transmissionLength >= distance(point1.position.x, point1.position.y, point2.position.x, point2.position.y)) {
        return true;
    }
    return false;
}
//TODO: startminimum as max value
function tryupdateorrelief(p1,p2){
    //update parent id and index
    if(p2.d==null){
        p2.d=p1.d+distance(p1,p2);
        //p2.parent.id=p1.id;
        p2.parent.index=p1.index;
    }
    //relief
    else if(p2.d<p1.d+distance(p1,p2)){
        p2.d=p1.d+distance(p1,p2);
       // p2.parent.id=p1.id;
        p2.parent.index=p1.index;
    }
}
function findnextminimumpoint(pointsingraph){
    var minimum=null;
    for (var i = 0; i < pointsingraph.length; i++) {
            if(!pointsingraph[i].isvisited && (minimum==null || pointsingraph[i].d<minimum.d)){
                minimum=pointsingraph[i];
            }
    }
    return minimum;
}

function dijekstra(point, pointsingraph) {
    for (var i = 0; i < pointsingraph.length; i++) {
        if (isnieghber(point,pointsingraph[i]) && point.isvisited === false) {
            tryupdateorrelief(point,pointsingraph[i]);
        }
    }
    point.isvisited=true;
    //TODO : if there is no one
    //check if it not null
    var nextpoint=findnextminimumpoint(pointsingraph);
    if(nextpoint!=null){
        dijekstra(nextpoint,pointsingraph);
    }

    // and for everyniceghbor check if you can relief them
    //if not visited && nighber
    // call tryupdateorrelief
    //isvisted =true
    //find next point not visited and minimal value
}


function routeatob(startpoint,endpoint,pointsingraph,route){
    if(endpoint==startpoint){
        return
    }
    routeatob(startpoint,parentpointsingraph[endpoint.parent.index],pointsingraph,route);
    if(route=[]){
        route=[parentpointsingraph[endpoint.parent.index].id];
    }
    else {
        route.push(parentpointsingraph[endpoint.parent.index].id);
    }
}