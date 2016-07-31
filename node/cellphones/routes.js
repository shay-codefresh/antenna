/**
 * Created by shay on 24/07/2016.
 */
var fs = require("fs");

var _ = require('lodash-node');
var tools = require('./func');



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
                            console.Error(err);
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
    tools.phase1(filename, {x: x1, y: y1}, {x: x2, y: y2}, function (err, res) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("step 1 finished");
            console.log(res);
            return res;
        }
    })
}


function steptwo(filename) {
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

            //for (var i =4; i <5; i++) {
            var i =6;
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

                        //stepone("checkit.json");
                        steptwo("checkit.json");
                        //stepthree("checkit.json");
                        //stepfour("checkit.json");
                        deletetest("checkit.json");
                    }
                });
           // }
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