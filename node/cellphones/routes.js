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

function stepone() {

    var x1=1;
    var y1=2;
    var x2=61;
    var y2=61;
    tools.phase1("antenna.json",{x:x1,y:y1},{x:x2,y:y2}, function (err, res) {
        if(err){
            return err;
        }
        else {
            console.log(res);
            return res;
        }
    })
}

stepone();

function steptwo(){

    var x1=1;
    var y1=2;
    var x2=61;
    var y2=61;

    tools.phase2("antenna.json",{x:x1,y:y1},{x:x2,y:y2}, function (err, res) {
        if(err){
            return err;
        }
        else {
            console.log(res);
            return res;
        }
    })
}

steptwo();