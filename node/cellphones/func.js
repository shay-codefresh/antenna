var math = require('mathjs');
var fs = require("fs");
var _ = require('lodash-node');

function distance(dot1, dot2) {
    //the function can handle points and antennas
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
        throw new Error("negative values")
    }
    else {

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    //TODO tr is not minus. if it is send error -check if the code can handle the error

}
function findclosestantenna(antennas, antenna1, antenna2, point1, point2, callback) {
    for (var i = 0; i < antennas.length; i++) {
        if (antennas[i].transmissionLength == undefined || antennas[i].transmissionLength == null) {
            return new Error("no transmissionLength");
            ;
        }
        antennas[i].distance1 = distance(antennas[i], point1);
        antennas[i].distance2 = distance(antennas[i], point2);
        if (antennas[i].distance1 < antenna1[1]) {
            antenna1[0] = antennas[i].id;
            antenna1[1] = antennas[i].distance1;
        }
        if (antennas[i].distance2 < antenna2[1]) {
            antenna2[0] = antennas[i].id;
            antenna2[1] = antennas[i].distance2;
        }
    }
}

function phase1(filename, point1, point2, callback) {
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        if (err) {
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            //ann array with id and distance,each array for each cellphone
            var antennapoint1 = [0, Number.MAX_VALUE];
            var antennapoint2 = [0, Number.MAX_VALUE];
            var antennas = JSON.parse(result).antennas;
            if (antennas.length == 0) {
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }
            //var antennas = antennas.antennas;
            try {
                findclosestantenna(antennas, antennapoint1, antennapoint2, point1, point2);
            }
            catch (ex) {
                //callback(ex);
                callback(new Error("bad input"));
                return;
            }
            //in case its the same antenna
            if (antennapoint1[0] === antennapoint2[0]) {
                callback(null, [antennapoint1[0]]);
                return;
            }
            else {
                var result = [antennapoint1[0], antennapoint2[0]];
                callback(null, result);
                return;
            }
        }
    });
}


function phase2(filename, point1, point2, callback) {
    fs.readFile(__dirname + '/' + filename, function (err, result) {
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
            var answer = null;
            try {
                answer = findantennasforpoints(antennas, antennas1, antennas2, point1, point2);

            }
            catch (ex) {
                //callback(ex);
                callback(new Error("bad input"));

                return;
            }
            if (answer != null) {
                callback(null, answer);
                return;
            }
            if (antennas2.length == 0 || antennas1.length == 0) {
//if one of the cellphone dont have relavant antenna
                var error = new Error("no antennas in range");
                callback(error);
                return;
            }

            try {
                answer = find2antennasinrange(antennas1, antennas2);
            }
            catch (ex) {
                callback(error);
                return
            }
            if (answer.message !== undefined) {
                callback(answer);
                return;
            }
            else if (answer != null) {
                callback(null, answer);
                return;
            }
        }
    });
}

function find2antennasinrange(antennas1, antennas2) {
    for (var i = 0; i < antennas1.length; i++) {
        for (var j = 0; j < antennas2.length; j++) {
//not the same antenna and the sum of transmissionLengths is bigger than the distance between them
            if (antennas1[i].id != antennas2[j].id && antennas1[i].transmissionLength + antennas2[j].transmissionLength >= distance(antennas1[i], antennas2[j])) {
                return [antennas1[i].id, antennas2[j].id];
            }
        }
    }
    return new Error("no antennas in range");
}

function findantennasforpoints(antennas, antennas1, antennas2, point1, point2) {
    for (var i = 0; i < antennas.length; i++) {
        if (antennas[i].transmissionLength == undefined || antennas[i].transmissionLength == null) {
            //if there is bad input
            //       callback(new Error("no transmissionLength"));
            throw new Error("no transmissionLength");
        }
        //distance 1 - distance from point 1
        antennas[i].distance1 = distance(antennas[i], point1);
        antennas[i].distance2 = distance(antennas[i], point2);
        //*** add line about the checking if it is the same one

        //in case its the same antenna**
        if (antennas[i].distance1 <= antennas[i].transmissionLength && antennas[i].distance2 <= antennas[i].transmissionLength) {
            //callback(null, [antennas[i].id]);
            return [antennas[i].id];
        }
        //enters only the relevants antennas for each cellphone
        if (antennas[i].distance1 <= antennas[i].transmissionLength) {
            antennas1.push(antennas[i]);
        }
        if (antennas[i].distance2 <= antennas[i].transmissionLength) {
            antennas2.push(antennas[i]);
        }
    }
}
//minimum route

var minroute = [];
var isstarted = false;

function copyarray(array2) {
    var result = [array2[0]];
    for (var i = 1; i < array2.length; i++) {
        result.push(array2[i]);
    }
    return result;
}
//TODO case of same id entered
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
        //case start point is not antenna-cellphone
        if (antennaroute.length == 0) {
            //case both point are cellphone and they have mutual antennas
            antennaroute = [mutualantennasinrange[0]];
        }
        else {
            antennaroute.push(mutualantennasinrange[0]);
        }
        if (isstarted == false) {
            minroute = copyarray(antennaroute);
            isstarted = true;
            return;
        }
        if (antennaroute.length < minroute.length) {
            minroute = copyarray(antennaroute);
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
        var antennanewroute = [];
        if (antennaroute.length == 0) {
            antennanewroute = [antennasinrange[i]];
        }
        else {
            antennanewroute = copyarray(antennaroute);
            antennanewroute.push(antennasinrange[i]);
        }
        //recursive call for next step . from antennasinrange[i] as start point
        findroute(antennasinrange[i], endpoint, notrepeatedantennas, antennanewroute);
    }

    return;
}
//gets a point and and array and return an array of antennas that are in the range of the point
function validantennasinrange(point, array) {
    var results = [];
    //if its a point
    if (point.transmissionLength == undefined) {
        for (var i = 0; i < array.length; i++) {

            if (array[i].transmissionLength == undefined || array[i].transmissionLength == null) {
                throw new Error("no transmissionLength");
            }
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
        if (err) { //todo: change to !err ...
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            minroute = [];
            isstarted = false;
            //ann array with id and distance
            var antennas = JSON.parse(result).antennas;
            var history = [];

            //TODO if startpoint=endpoint || one of them is undefind and in stable condition
            try {
                //minroute=copyarray(antennas);
                findroute(point1, point2, antennas, history);
            }
            catch (er) {
                callback(er);
                return;
            }

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

function phase4initializepoint(point1, antennas) {
    point1.transmissionLength = 0;
    point1.parent = -1;
    point1.id = -1;
    point1.d = 0;
    point1.isvisited = false;
    point1.index = antennas.length;
    point1.parentindex = antennas.length;
}
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

            point2.id = -2;
            point2.transmissionLength = 0;
            antennas.push(point2);

            for (var i = 0; i < antennas.length; i++) {
                if (antennas[i].transmissionLength == undefined || antennas[i].transmissionLength == null) {
                    callback(new Error("no transmissionLength"));
                    return;
                }
                antennas[i].d = Number.MAX_VALUE;
                antennas[i].parent = null;
                antennas[i].index = i;
                antennas[i].isvisited = false;
                antennas[i].parentindex = null;
            }
            phase4initializepoint(point1, antennas);
            antennas.push(point1);
            try {
                dijekstra(point1, antennas);
            }
            catch (ex) {
                callback(new Error("bad input"));
                //callback(ex);
                return;
            }

            var route = [];
            //if endpoint not null
            if (antennas[antennas.length - 2].parentindex != null) {
                route = [antennas[antennas[antennas.length - 2].parentindex].id];
                route = routep1top2(point1, antennas[antennas[antennas.length - 2].parentindex], antennas, route);
                callback(null, route);
            }
            else {
                var error = new Error("no antennas in range");
                callback(error);
            }
        }
    })
}


function isneighbour(point1, point2) {
    if (point1.transmissionLength + point2.transmissionLength >= distance(point1, point2)) {
        return true;
    }
    return false;
}

function tryupdateorrelief(p1, p2) {
    //update parent id and index
    if (p2.d > p1.d + distance(p1, p2)) {
        p2.d = p1.d + distance(p1, p2);
        p2.parent = p1.id;
        p2.parentindex = p1.index;
    }
}
function findnextminimumpoint(pointsingraph) {
    var minimum = null;
    for (var i = 0; i < pointsingraph.length; i++) {
        if (!pointsingraph[i].isvisited && (minimum == null || pointsingraph[i].d < minimum.d)) {
            minimum = pointsingraph[i];
        }
    }
    return minimum;
}

function dijekstra(point, pointsingraph) {
    for (var i = 0; i < pointsingraph.length; i++) {

        //skip the case its endpoint or startpoint
        if (isneighbour(point, pointsingraph[i]) && point.isvisited === false) {
            tryupdateorrelief(point, pointsingraph[i]);
        }
    }
    point.isvisited = true;
    //check if it not null
    var nextpoint = findnextminimumpoint(pointsingraph);
    if (nextpoint != null) {
        dijekstra(nextpoint, pointsingraph);
    }
}

function routep1top2(startpoint, endpoint, pointsingraph, route) {
    if (endpoint == startpoint || endpoint.parentindex == endpoint.index || endpoint.parent == -1 || endpoint.parent == null) {
        return route;
    }
    if (endpoint.parentindex != undefined) {
        route.unshift(pointsingraph[endpoint.parentindex].id);
        routep1top2(startpoint, pointsingraph[endpoint.parentindex], pointsingraph, route);
    }
    return route;
}


function getminroute() {
    return minroute;
}

function switchfunc(func) {
    findroute = func;
    //funcname=func;
}

module.exports.switchfunc = switchfunc;
module.exports.phase1 = phase1;
module.exports.phase2 = phase2;
module.exports.phase3 = phase3;
module.exports.phase4 = phase4;
module.exports.distance = distance;
module.exports.findclosestantenna = findclosestantenna;
module.exports.copyarray = copyarray;
module.exports.findroute = findroute;
module.exports.validantennasinrange = validantennasinrange;
module.exports.phase4initializepoint = phase4initializepoint;
module.exports.isneighbour = isneighbour;
module.exports.tryupdateorrelief = tryupdateorrelief;
module.exports.findnextminimumpoint = findnextminimumpoint;
module.exports.dijekstra = dijekstra;
module.exports.routep1top2 = routep1top2;
module.exports.getminroute = getminroute;
module.exports.minroute = minroute;
module.exports.isstarted = isstarted;
module.exports.find2antennasinrange=find2antennasinrange;
module.exports.findantennasforpoints=findantennasforpoints;