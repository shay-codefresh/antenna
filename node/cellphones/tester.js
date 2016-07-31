'use strict';

/**
 * Created by shay on 24/07/2016.
 */
var fs     = require("fs");
var _      = require('lodash-node');
var tools  = require('./func');
var Q      = require('q');
var domain = require('domain');

function checkcode() {
    return Q.nfcall(fs.readFile, __dirname + '/checktask.json')
        .then(function (res) {
            res           = JSON.parse(res);
            var scenarios = res.scenarios;

            var handler = function (scenario, index) {
                console.log("Running test:" + index);
                return Q.delay(200)
                    .then(function(){
                        var antennasFileName = 'antennas:' + index + '.json';
                        return Q.nfcall(fs.writeFile, __dirname + '/' + antennasFileName, JSON.stringify({antennas: scenario.antennas}, null, 2))
                            .then(function () {
                                var cellPhone1 = {
                                    x: scenario.cellPhone1.x,
                                    y: scenario.cellPhone1.y
                                };
                                var cellPhone2 = {
                                    x: scenario.cellPhone1.x,
                                    y: scenario.cellPhone1.y
                                };

                                var phaseHandler = function (phaseNumber) {
                                    var deferred = Q.defer();

                                    var d = domain.create();
                                    d.on("error", function (err) {
                                        console.error("\tPhase " + phaseNumber + " failed. uncaught exception: " + err.toString());
                                        Q.delay(200)
                                            .then(deferred.resolve);
                                    });
                                    d.run(function () {
                                        Q.nfcall(tools["phase" + phaseNumber], antennasFileName, cellPhone1, cellPhone2)
                                            .then(function (res) {
                                                var passed = false;
                                                for (var i = 0; i < scenario.results["phase" + phaseNumber].length; i++) {
                                                    if (_.isEqual(res, scenario.results["phase" + phaseNumber][i][0])) {
                                                        break;
                                                    }
                                                }
                                                if (passed) {
                                                    console.log("\tPhase " + phaseNumber + " passed");
                                                }
                                                else {
                                                    console.error("\tPhase " + phaseNumber + " failed. result: " + JSON.stringify(res) + ". expected: " + JSON.stringify(scenario.results["phase" + phaseNumber][0]));
                                                }
                                            }, function (err) {
                                                if (scenario.results["phase" + phaseNumber][0] === "error" && err.toString() === "Error: no antennas in range") {
                                                    console.log("\tPhase " + phaseNumber + " passed");
                                                }
                                                else {
                                                    console.error("\tPhase " + phaseNumber + " failed. result: " + err.toString() + ". expected: " + JSON.stringify(scenario.results["phase" + phaseNumber][0]));
                                                }
                                            })
                                            .then(function () {
                                                return Q.delay(200)
                                            })
                                            .then(deferred.resolve);
                                    });

                                    return deferred.promise;
                                };

                                var phaseHandlers = [phaseHandler.bind(this, "1"), phaseHandler.bind(this, "2"), phaseHandler.bind(this, "3"), phaseHandler.bind(this, "4")];
                                return phaseHandlers.reduce(Q.when, Q.resolve());
                            })
                            .then(function(){
                                console.log("");
                                return Q.nfcall(fs.unlink, __dirname + '/' + antennasFileName);
                            });
                    });
            };

            var testHandlers = [];
            scenarios.forEach(function (scenario, index) {
                testHandlers.push(handler.bind(this, scenario, index + 1));
            });
            return testHandlers.reduce(Q.when, Q.resolve());
        });
}


checkcode();