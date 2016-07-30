/**
 * Created by shay on 24/07/2016.
 */
var fs = require("fs");

var _ = require('lodash-node');
var tools = require('./func');
/*
 function step1() {
 var x1=1;
 var y1=2;
 var x2=61;
 var y2=61;
 tools.myread("antenna.json",x1,y1,x2,y2, function (err, res) {
 if (err) {
 return err;
 }
 else {
 var anthennas=[];
 var ordered1=tools.orderarray(res,1);
 var ordered2=tools.orderarray(res,2);
 anthennas[0]=ordered1[0].id;
 anthennas[1]=ordered2[0].id;
 console.log(anthennas);
 return anthennas;
 }
 })
 }
 */

var x1 = 1;
var y1 = 1;
var x2 = 2;
var y2 = 2;
function runit(filename){
    tools.phase1(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
        if (err) {
            return err;
        }
        else {
            console.log("step 1 finished");
            console.log(res);
            //return res;
            tools.phase2(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log("step 2 finished");
                    console.log(res);
                    // return res;
                    tools.phase3(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            console.log("step 3 finished");
                            console.log(res);
                            //return res;
                        }
                    })
                }
            })
        }
    })
}

function stepone(filename) {
    /*
     var x1=1;
     var y1=1;
     var x2=2;
     var y2=2;
     */
    tools.phase1(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
        if (err) {
            return err;
        }
        else {
            console.log("step 1 finished");
            console.log(res);
            return res;
        }
    })
}


function steptwo(filename) {
    /*
     var x1=1;
     var y1=1;
     var x2=2;
     var y2=2;
     */

    tools.phase2(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("step 2 finished");
            console.log(res);
            return res;
        }
    })

}


function stepthree(filename) {
    tools.phase3(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("step 3 finished");
            console.log(res);
            return res;
        }
    })
}




function stepfour(filename) {
    tools.phase4(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("step 4 finished");
            console.log(res);
            return res;
        }
    })
}

function checkcode() {
    fs.readFile(__dirname + '/' + 'checktask.json', function (err, result) {

        if (err) {
            var error = new Error(err);
            callback(error);
            return;
        }
        else {
            result = JSON.parse(result);
            result = result.scenarios;
            //console.log(result);

            // console.log(Object.keys(result).length);

            for (var i =2; i <3; i++) {

<<<<<<< HEAD
=======
            for (var i =2; i <3; i++) {

>>>>>>> bf3698145c08e91b141c143399de53761e8c9a9a
                createfile({antennas: result[i].antennas}, "checkit.json", function (error) {
                    if (error) {
                        return console.log(error);
                    }
                    else {
                        console.log('scenarios :'+i);
                        x1 = result[i].cellPhone1.x;
                        y1 = result[i].cellPhone1.y;
                        x2 = result[i].cellPhone2.x;
                        y2 = result[i].cellPhone2.y;

<<<<<<< HEAD
                        //stepone("checkit.json");
                        //steptwo("checkit.json");
                        stepthree("checkit.json");
=======
                       //stepone("checkit.json");
                       //steptwo("checkit.json");
                       stepthree("checkit.json");
>>>>>>> bf3698145c08e91b141c143399de53761e8c9a9a
                        //stepfour("checkit.json");
                        deletetest("checkit.json");
                    }
                })
            }
        }
    })
}
checkcode();


function createfile(json, name, callback) {
    fs.writeFile(__dirname + '/' + name, JSON.stringify(json, null, 2), function (err) {
        if (err) {
            return console.log(err);
        }
    });
    callback(null)
}

function deletetest(name) {
    fs.unlink(__dirname + '/' + name, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}