var math = require('mathjs');
var fs = require("fs");
var _ = require('lodash-node');

function myread(filename, x1, y1, x2, y2, callback) {
    lodash_check = false;
    fs.readFile(__dirname + '/' + filename, function (err, result) {
        if (err) {
//check if the path is wrong
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            var antennas = JSON.parse(result);
            var answer = [];
            for (var ann in antennas) {
                //function add distance from dot1 and dot2
                //check if int.parse is needed
                ann.distance1 = distance(ann.x, ann.y, x1, y1);
                ann.distance2 = distance(ann.x, ann.y, x2, y2);
                answer.push(antennas[ann]);
            }
            callback(null, antennas);
            return;
        }
    });
}

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

                //in case its the same antenna
                if (antennas[i].distance1 <= antennas[i].transmissionLength && antennas[i].distance2 <= antennas[i].transmissionLength) {
                    callback(null, [antennas[i].id]);
                    return;
                }
//enters only the relevants antennas for each cellphone
                if (antennas[i].distance1 <= antennas[i].transmissionLength);
                {
                    antennas1.push(antennas[i]);
                }
                if (antennas[i].distance2 <= antennas[i].transmissionLength);
                {
                    antennas2.push(antennas[i]);
                }
            }
            if (antennas2.length == 0 || antennas1.length == 0) {
//if one of the cellphone dont have relavant antenna
                var error = new Error(err);
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
                throw new Error("no antennas in range");


            }
        }
    });
}

/*
 function checkrange(arr1, arr2) {
 var index1 = 0;
 var index2 = 0;
 //var result=[];

 while (index1 < arr1.length && index2 < arr2.length) {
 if (arr1[index1].transmissionLength + arr2[index2].transmissionLength >= distance(arr1[index1].position.x, arr1[index1].position.y, arr2[index2].position.x, arr2[index2].position.y)) {
 return [arr1[index1].id, arr2[index2].id];
 }
 if (arr1[index1].transmissionLength > arr2[index2].transmissionLength) {
 index2++;
 }
 else {
 index1++;
 }
 }
 throw new Error("no antennas in range");

 }
 */

module.exports.sortarray = sortarray;
//delete it
module.exports.myread = myread;
//module.exports.checkrange = checkrange;
module.exports.phase1 = phase1;
module.exports.phase2 = phase2;
module.exports.distance = distance;