/**
 * Created by shay on 24/07/2016.
 */


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

var x1=1;
var y1=1;
var x2=2;
var y2=2;

function stepone() {
    /*
     var x1=1;
     var y1=1;
     var x2=2;
     var y2=2;
     */
    tools.phase1("antenna.json",{x:x1,y:y1},{x:x2,y:y2}, function (err, res) {
        if(err){
            return err;
        }
        else {
            console.log("step 1 started");
            console.log(res);
            return res;
        }
    })
}

stepone();

function steptwo(){
    /*
     var x1=1;
     var y1=1;
     var x2=2;
     var y2=2;
     */

    tools.phase2("antenna.json",{x:x1,y:y1},{x:x2,y:y2}, function (err, res) {
        if(err){
            console.log(err);
        }
        else {
            console.log("step 2 started");
            console.log(res);
            return res;
        }
    })
}

steptwo();


function stepthree(){
    /*
     var x1=1;
     var y1=1;
     var x2=2;
     var y2=2;
     */

    tools.phase3("antenna.json",{x:x1,y:y1},{x:x2,y:y2}, function (err, res) {
        if(err){
            console.log(err);
        }
        else {
            //var yyy={x:x1,y:y1};
            //console.log(yyy.isNull("hey"))
            console.log("step 3 started");
            console.log(res);
            return res;
        }
    })
}

stepthree();

