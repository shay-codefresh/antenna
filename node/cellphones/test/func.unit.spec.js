/**
 * Created by shay on 31/07/2016.
 */
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var tools = require('../func');


describe("antennas functions tests", function () {
    describe("positive", function () {
        it("should return the distance of 2 points,distance", function () {
            expect(tools.distance({x: 1, y: 0}, {x: 2, y: 0})).to.equal(1);
            expect(tools.distance({x: 1, y: 2}, {x: 0, y: 2})).to.equal(1);
            expect(tools.distance({x: 0, y: 0}, {x: 4, y: 3})).to.equal(5);
//antenna and dot
            expect(tools.distance({x: 6, y: 4},
                {
                    "id": "2",
                    "position": {
                        "x": 9,
                        "y": 8
                    },
                    "transmissionLength": 50
                })).to.equal(5);
            expect(tools.distance(
                {
                    "id": "2",
                    "position": {
                        "x": 9,
                        "y": 8
                    },
                    "transmissionLength": 50
                }, {x: 6, y: 4})).to.equal(5);
            //checking distance bewtween antennas
            expect(tools.distance({
                "id": "1",
                "position": {
                    "x": 2,
                    "y": 2
                },
                "transmissionLength": 20
            }, {
                "id": "2",
                "position": {
                    "x": 0,
                    "y": 2
                },
                "transmissionLength": 50
            })).to.equal(2);
            expect(tools.distance({
                "id": "1",
                "position": {
                    "x": 2,
                    "y": 0
                },
                "transmissionLength": 20
            }, {
                "id": "1",
                "position": {
                    "x": 2,
                    "y": 2
                },
                "transmissionLength": 10
            })).to.equal(2);
            expect(tools.distance({
                "id": "1",
                "position": {
                    "x": 8,
                    "y": 9
                },
                "transmissionLength": 920
            }, {
                "id": "1",
                "position": {
                    "x": 4,
                    "y": 6
                },
                "transmissionLength": 120
            })).to.equal(5);
        });

        it("should return the closest antennas of a given point,findclosestantenna", function () {
            var antennas = [
                {
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "2",
                    "position": {
                        "x": 20,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "3",
                    "position": {
                        "x": 30,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "4",
                    "position": {
                        "x": 40,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "5",
                    "position": {
                        "x": 50,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150
                }
            ];
            var antenna1 = [0, Number.MAX_VALUE];
            var antenna2 = [0, Number.MAX_VALUE];
            var point1 = {x: 1, y: 1};
            var point2 = {x: 60, y: 0};
            tools.findclosestantenna(antennas, antenna1, antenna2, point1, point2);
            expect(antenna1[0][0]).to.equal("1");
            expect(antenna2[0][0]).to.equal("5");
        });
        it("should return a copy of a given array,copyarray", function () {
            // var array1=[1,5,7,8,9,33,85,77];
            var array1 = [
                {
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "2",
                    "position": {
                        "x": 20,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "3",
                    "position": {
                        "x": 30,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "4",
                    "position": {
                        "x": 40,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "5",
                    "position": {
                        "x": 50,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150
                }
            ];
            var array2 = tools.copyarray(array1);
            for (var i = 0; i < array1.length; i++) {
                expect(array1[i]).to.equal(array2[i]);
            }
        });
        it("should give the neighbour antennas of a specific point,validantennasinrange", function () {
            var antennas = [
                {
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "2",
                    "position": {
                        "x": 20,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "3",
                    "position": {
                        "x": 30,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "4",
                    "position": {
                        "x": 40,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "5",
                    "position": {
                        "x": 50,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150
                }
            ];
            var array = tools.validantennasinrange({x: 1, y: 1}, antennas);
            expect(array).to.deep.equal(
                [{
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                    {
                        "id": "6",
                        "position": {
                            "x": 150,
                            "y": 0
                        },
                        "transmissionLength": 150
                    }]);
        });
        it("should start the point with startup properties,phase4initializepoint", function () {
            var point1={x:5,y:5};
            var antennas = [
                {
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "2",
                    "position": {
                        "x": 20,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "3",
                    "position": {
                        "x": 30,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "4",
                    "position": {
                        "x": 40,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "5",
                    "position": {
                        "x": 50,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150
                }
            ];
            tools.phase4initializepoint(point1, antennas);
            expect(point1).to.deep.equal({
                x: 5,
                y: 5,
                transmissionLength: 0,
                parent: -1,
                id: -1,
                d: 0,
                isvisited: false,
                index: antennas.length,
                parentindex: antennas.length
            });
        });
        it("should return true if the given points are neighbours,isneighbour", function () {
            expect(tools.isneighbour({x:1,y:1,transmissionLength:0},{position:{x:1,y:5},transmissionLength:15})).to.equal(true);
        });
        //
        it("should return an array with ids of antennas which represent the route ,routep1top2  ", function () {
            var point1={
                "x": 1,
                "y": 0,
                "transmissionLength": 0,
                "parent": -1,
                "id": -1,
                "d": 0,
                "isvisited": true,
                "index": 7,
                "parentindex": 7
            };
            var point2={
                "x": 60,
                "y": 0,
                "id": -2,
                "transmissionLength": 0,
                "d": 59,
                "parent": "5",
                "index": 6,
                "isvisited": true,
                "parentindex": 4
            };
            var route=[];
            var antennas=[
                {
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 11,
                    "d": 9,
                    "parent": -1,
                    "index": 0,
                    "isvisited": true,
                    "parentindex": 7
                },
                {
                    "id": "2",
                    "position": {
                        "x": 20,
                        "y": 0
                    },
                    "transmissionLength": 11,
                    "d": 19,
                    "parent": "1",
                    "index": 1,
                    "isvisited": true,
                    "parentindex": 0
                },
                {
                    "id": "3",
                    "position": {
                        "x": 30,
                        "y": 0
                    },
                    "transmissionLength": 11,
                    "d": 29,
                    "parent": "1",
                    "index": 2,
                    "isvisited": true,
                    "parentindex": 0
                },
                {
                    "id": "4",
                    "position": {
                        "x": 40,
                        "y": 0
                    },
                    "transmissionLength": 11,
                    "d": 39,
                    "parent": "2",
                    "index": 3,
                    "isvisited": true,
                    "parentindex": 1
                },
                {
                    "id": "5",
                    "position": {
                        "x": 50,
                        "y": 0
                    },
                    "transmissionLength": 11,
                    "d": 49,
                    "parent": "3",
                    "index": 4,
                    "isvisited": true,
                    "parentindex": 2
                },
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150,
                    "d": 149,
                    "parent": -1,
                    "index": 5,
                    "isvisited": true,
                    "parentindex": 7
                },
                {
                    "x": 60,
                    "y": 0,
                    "id": -2,
                    "transmissionLength": 0,
                    "d": 59,
                    "parent": "5",
                    "index": 6,
                    "isvisited": true,
                    "parentindex": 4
                },
                {
                    "x": 1,
                    "y": 0,
                    "transmissionLength": 0,
                    "parent": -1,
                    "id": -1,
                    "d": 0,
                    "isvisited": true,
                    "index": 7,
                    "parentindex": 7
                }
            ];
            expect(tools.routep1top2(point1,point2,antennas,route)).to.deep.equal(["1","3","5"]);
            //routep1top2
        });
//update or relief

        it("should update point 2 properties, tryupdateorrelief", function () {
            var point1={x:2,y:2,parent:"1",index:"1",id:1,d:10};
            var point2={x:5,y:6,parent:"58",index:"8",parentindex:"5",id:1,d:150};
            tools.tryupdateorrelief(point1,point2);
            expect(point2).to.deep.equal({x:5,y:6,parent:1,index:"8",parentindex:"1",id:1,d:15});
        });

        it("should return the next minimum of the array,findnextminimumpoint", function () {
            var graph=[
                {
                    "id": "1",
                    "position": {
                        "x": 100,
                        "y": 0
                    },
                    "transmissionLength": 100,
                    "d": 100,
                    "parent": -1,
                    "index": 0,
                    "isvisited": false,
                    "parentindex": 4
                },
                {
                    "id": "2",
                    "position": {
                        "x": 0,
                        "y": 100
                    },
                    "transmissionLength": 100,
                    "d": 100,
                    "parent": -1,
                    "index": 1,
                    "isvisited": false,
                    "parentindex": 4
                },
                {
                    "id": "3",
                    "position": {
                        "x": 50,
                        "y": 50
                    },
                    "transmissionLength": 100,
                    "d": 70.71067811865476,
                    "parent": -1,
                    "index": 2,
                    "isvisited": false,
                    "parentindex": 4
                },
                {
                    "x": 100,
                    "y": 100,
                    "id": -2,
                    "transmissionLength": 0,
                    "d": 1.7976931348623157e+308,
                    "parent": null,
                    "index": 3,
                    "isvisited": false,
                    "parentindex": null
                },
                {
                    "x": 0,
                    "y": 0,
                    "transmissionLength": 0,
                    "parent": -1,
                    "id": -1,
                    "d": 0,
                    "isvisited": true,
                    "index": 4,
                    "parentindex": 4
                }
            ];
            expect(tools.findnextminimumpoint(graph).id).to.equal("3");
        })

        it("should return the route of a given antennas array,findroute", function () {
            var antennas=[
                {
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "2",
                    "position": {
                        "x": 20,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "3",
                    "position": {
                        "x": 30,
                        "y":0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "4",
                    "position": {
                        "x": 40,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "5",
                    "position": {
                        "x": 50,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150
                }
            ];
            var route=[];
            tools.findroute({x:1,y:0},{x:60,y:0},antennas,route);
            expect(tools.getminroute()).to.deep.equal([
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150
                }
            ]);
        })
    });
    describe("negative", function () {
        it("should fail when the values are negative,distance", function () {

            try {
                tools.distance({x: 0, y: 0}, {x: 4, y: -53});
            }
            catch (ex) {
                expect(ex.message).to.contain("negative values");
            }
            try {
                tools.distance({x: 6, y: 4},
                    {
                        "id": "2",
                        "position": {
                            "x": -9,
                            "y": 8
                        },
                        "transmissionLength": 50
                    });
            }
            catch (ex) {
                expect(ex.message).to.contain("negative values");
            }
            try {
                tools.distance({
                    "id": "1",
                    "position": {
                        "x": -2,
                        "y": 2
                    },
                    "transmissionLength": 20
                }, {
                    "id": "2",
                    "position": {
                        "x": 0,
                        "y": 2
                    },
                    "transmissionLength": 50
                });
            }
            catch (ex) {
                expect(ex.message).to.contain("negative values");
            }
        });



        it("should return an empty array if there are no neighbour antennas of a specific point,validantennasinrange", function () {
            var antennas = [
                {
                    "id": "1",
                    "position": {
                        "x": 10,
                        "y": 0
                    },
                    "transmissionLength": 1
                },
                {
                    "id": "2",
                    "position": {
                        "x": 20,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "3",
                    "position": {
                        "x": 30,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "4",
                    "position": {
                        "x": 40,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "5",
                    "position": {
                        "x": 50,
                        "y": 0
                    },
                    "transmissionLength": 11
                },
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 15
                }
            ];
            var array = tools.validantennasinrange({x: 1, y: 1}, antennas);
            expect(array.length).to.equal(0);
        });

        it("should return false if the given points are not neighbours,isneighbour", function () {
            expect(tools.isneighbour({x:1,y:1,transmissionLength:0},{position:{x:1,y:5},transmissionLength:1})).to.equal(false);
        });

        it("should return error for bad input,tryupdateorrelief", function () {
            var point1={x:2,y:2,parent:"1",index:"1",id:1,d:10};
            var point2={x:-5,y:6,parent:"58",index:"8",parentindex:"5",id:1,d:150};

            try {
                tools.tryupdateorrelief(point1,point2);
            }
            catch (ex) {
                expect(ex.message).to.contain("negative values");
            }
        })

        it("should return the route of a given antennas array,findroute", function () {
            var antennas=[];
            var route=[];
            tools.findroute({x:1,y:0},{x:60,y:0},antennas,route);
            expect(tools.getminroute()).to.deep.equal([
                {
                    "id": "6",
                    "position": {
                        "x": 150,
                        "y": 0
                    },
                    "transmissionLength": 150
                }
            ]);
        })


        // check phase 3
        // it("should phase 3", function () {
        //     tools.a(function () {
        //         console.log("hehagdhadhadgdaga")
        //     })
        //     tools.phase3('antennatest.json',{x:1,y:2},{x:2,y:2},function(err){
        //         expect(err.message).to.contain("no antennas in range");
        //     })
        // })


//error cases for all phases
        it("should return error message no antennas in range", function () {
            tools.phase1('antennatest.json',{x:1,y:2},{x:2,y:2},function(err){
                expect(err.message).to.contain("no antennas in range");
            })
        })
        it("should return error message no antennas in range", function () {
            tools.phase2('antennatest.json',{x:1,y:2},{x:2,y:2},function(err){
                expect(err.message).to.contain("no antennas in range");
            })
        })
        it("should return error message no antennas in range", function () {
            tools.phase3('antennatest.json',{x:1,y:2},{x:2,y:2},function(err){
                expect(err.message).to.contain("no antennas in range");
            })
        })

        it("should return error message no antennas in range", function () {
            tools.phase4('antennatest.json',{x:1,y:2},{x:2,y:2},function(err){
                    expect(err.message).to.contain("no antennas in range");
            })
        })



        it("should return error message negative values", function () {
            tools.phase1('antenna.json',{x:1,y:-2},{x:2,y:2},function(err){
                expect(err.message).to.contain("negative values");
            })
        })
        it("should return error message negative values", function () {
            tools.phase2('antenna.json',{x:1,y:-2},{x:2,y:2},function(err){
                expect(err.message).to.contain("negative values");
            })
        })
        it("should return error message negative values", function () {
            tools.phase3('antenna.json',{x:1,y:-2},{x:2,y:2},function(err){
                expect(err.message).to.contain("negative values");
            })
        })
        it("should return error message negative values", function () {
            tools.phase4('antenna.json',{x:1,y:-2},{x:2,y:2},function(err){
                expect(err.message).to.contain("negative values");
            })
        })
    });
});




