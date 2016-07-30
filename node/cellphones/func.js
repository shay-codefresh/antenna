var math = require('mathjs');
var fs = require("fs");
var _ = require('lodash-node');

//todo: change this to opts
// function(opts){
//     return math.sqrt(math.pow(opts.x2 - opts.x1, 2) + math.pow(opts.y2 - opts.y1, 2));
// }
function distance12(x1, y1, x2, y2) {

    if(x1<0||x2<0||y1<0||y2<0){
        return new error("negative values")
    }
<<<<<<< HEAD
    else{
=======
        else{
>>>>>>> bf3698145c08e91b141c143399de53761e8c9a9a
        return math.sqrt(math.pow(x2 - x1, 2) + math.pow(y2 - y1, 2));
    }
    //TODO tr is not minus. if it is send error -check if the code can handle the error

}

function distance(dot1, dot2) {
    var x1;
    var y1;
    var x2;
    var y2;
    if (dot1.position == undefined) {
        x1 = dot1.x;
        y1 = dot1.y;
    }
    else {
        x1 = dot1.position.x;
        y1 = dot1.position.y;
    }
    if (dot2.position == undefined) {
        x2 = dot2.x;
        y2 = dot2.y;
    }
    else {
        x2 = dot2.position.x;
        y2 = dot2.position.y;
    }
    if (x1 < 0 || x2 < 0 || y1 < 0 || y2 < 0) {
        return new error("negative values")
    }
    else {

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    //TODO tr is not minus. if it is send error -check if the code can handle the error

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
                antennas[i].distance1 = distance(antennas[i],point1);
                antennas[i].distance2 = distance(antennas[i],point2);
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
                antennas[i].distance1 = distance(antennas[i],point1);
                antennas[i].distance2 = distance(antennas[i],point2);

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
                        if (antennas1[i].id != antennas2[j].id && antennas1[i].transmissionLength + antennas2[j].transmissionLength >= distance(antennas1[i], antennas2[j])) {
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
        if (antennaroute.length == 0) {
            //case both point are cellphone and they have mutual antennas
            antennaroute = [mutualantennasinrange[0]];
        }
        else {
            antennaroute.push(mutualantennasinrange[0]);
        }
        //TODO:check if you can run this line before checking the case of no items in array
        if (minroute.length == 0 || mutualantennasinrange.length < minroute.length) {
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

    return;
}
//gets a point and and array and return an array of antennas that are in the range of the point
function validantennasinrange(point, array) {
    var results = [];
    //if its a point
    if (point.transmissionLength == undefined) {
        for (var i = 0; i < array.length; i++) {

            if (array[i].transmissionLength >= distance(array[i], point)) {
                results.push(array[i]);
            }
        }
    }
//if its an antenna
    else {
        for (var i = 0; i < array.length; i++) {
            if (array[i].transmissionLength + point.transmissionLength >= distance(array[i], point)) {
                results.push(array[i]);
            }
        }
    }
    return results;
}

function phase3(filename, point1, point2, callback) {
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

            //TODO if startpoint=endpoint || one of them is undefind and in stable condition
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


module.exports.phase1 = phase1;
module.exports.phase2 = phase2;
module.exports.phase3 = phase3;
module.exports.phase4 = phase4;




function phase4(filename, point1, point2, callback) {

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
            var answer = [];
            if (point1.x === point2.x && point1.y === point2.y) {
                answer = validantennasinrange(point1, antennas); //maybe change to let.. OR define the variable only in 1 place
                if (answer.length !== 0) {
                    callback(null, [answer[0].id]);
                    return;
                }
                else {
                    var error = new Error("no antennas in range");
                    callback(error);
                    return;
                }
            }

            point2.id=-2;
            point2.transmissionLength =0;
            antennas.push(point2);

            for (var i = 0; i < antennas.length; i++) {
                antennas[i].d = Number.MAX_VALUE;
                //TODO change check if it works
                //make sure that im using null and max value at correct places
                antennas[i].parent = null;
                //change all parent place so they include id
                antennas[i].index = i;
                antennas[i].isvisited = false;
                antennas[i].parentindex=null;
                //TOdo check parent index !=null
            }
            //correct it it needs id ,
            point1.transmissionLength =0;
            point1.parent = -1;
            point1.id=-1;
            point1.d = 0;
            point1.isvisited = false;
            point1.index = antennas.length;
            point1.parentindex = antennas.length;
            antennas.push(point1);

            //point1.parent=point1;


            //read the file
            //add startpoint and endpoint,endpoint and  all antennas get infinity,startpoint dont

            //make a new array with properties : parent , d, isvisited ,index
            //call the function
            dijekstra(point1,antennas);
            var route = [];

            route=routep1top2(point1,antennas[antennas.length-2], antennas, route);
            if (route.length!=0) {
                callback(null, route);
            }
            else {
                var error = new Error("no antennas in range");
                callback(error);
            }



            return;
            //caculate best route from a to

            //check if no nighbers
        }
    })
}



//TODO dont write the same code twice
function isnieghber(point1, point2) {
    if (point1.transmissionLength + point2.transmissionLength >= distance(point1, point2)) {
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
        p2.parent=p1.id;
        p2.parentindex=p1.index;
    }
    //relief
    else if(p2.d>p1.d+distance(p1,p2)){
        p2.d=p1.d+distance(p1,p2);
<<<<<<< HEAD
        // p2.parent.id=p1.id;
=======
       // p2.parent.id=p1.id;
>>>>>>> bf3698145c08e91b141c143399de53761e8c9a9a
        p2.parent=p1.id;
        p2.parentindex=p1.index;
    }
}
function findnextminimumpoint(pointsingraph){
    var minimum=null;
    for (var i = 0; i < pointsingraph.length; i++) {
<<<<<<< HEAD
        if(!pointsingraph[i].isvisited && (minimum==null || pointsingraph[i].d<minimum.d)){
            minimum=pointsingraph[i];
        }
=======
            if(!pointsingraph[i].isvisited && (minimum==null || pointsingraph[i].d<minimum.d)){
                minimum=pointsingraph[i];
            }
>>>>>>> bf3698145c08e91b141c143399de53761e8c9a9a
    }
    return minimum;
}

function dijekstra(point, pointsingraph) {
    for (var i = 0; i < pointsingraph.length; i++) {

        //skip the case its endpoint or startpoint
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

//TODO check parent index

function routep1top22(startpoint,endpoint,pointsingraph,route) {
    while (endpoint != startpoint||endpoint.parentindex != endpoint.index){
        if (route.length== 0) {
            // if (pointsingraph[endpoint.parentindex]!= undefined) {
            route = [pointsingraph[endpoint.parentindex].id];
        }     else {
            route.push(pointsingraph[endpoint.parentindex].id);
        }
        endpoint=pointsingraph[endpoint.parentindex];
    }
    return route;
}

function routep1top2(startpoint,endpoint,pointsingraph,route) {
    if (endpoint == startpoint||endpoint.parentindex == endpoint.index) {
        return
    }
    //todo delete the if
    if (endpoint.parentindex != undefined) {
        routep1top2(startpoint, pointsingraph[endpoint.parentindex], pointsingraph, route);
    }
    else return;

    if (route = []) {
<<<<<<< HEAD
        // if (pointsingraph[endpoint.parentindex]!= undefined) {
        route = [pointsingraph[endpoint.parentindex].id];
    }
    else {
        //todo delete the if
        //         if (pointsingraph[endpoint.parentindex] != undefined) {
        route.push(pointsingraph[endpoint.parentindex].id);
    }

    //   }
=======
       // if (pointsingraph[endpoint.parentindex]!= undefined) {
            route = [pointsingraph[endpoint.parentindex].id];
        }
        else {
            //todo delete the if
   //         if (pointsingraph[endpoint.parentindex] != undefined) {
                route.push(pointsingraph[endpoint.parentindex].id);
            }

     //   }
>>>>>>> bf3698145c08e91b141c143399de53761e8c9a9a
    //}
    return route;
}