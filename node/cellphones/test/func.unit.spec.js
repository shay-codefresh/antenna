/**
 * Created by shay on 31/07/2016.
 */
var chai = require('chai');
var expect = chai.expect;
var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var tools = require('../routes');


function preparetest(func) {
    console.log(__dirname);
    fs.readFile(__dirname + '/' + 'checktask2.json', function (err, result) {

        //fs.readFile('/Users/shay/WebstormProjects/test/node/cellphones/checktask.json', function (err, result) {
        if (err) {
            var error = new Error(err);
            callback(error);
            return;
        }
        else {

            result = JSON.parse(result);
            result = result.scenarios;
            tools.createfile({antennas: result[i].antennas}, "checkit.json", func);
        }
    });
}

describe("antennas functions tests",function () {
    describe("phase 1",function () {
        it("same place no antennas",function () {
            expect(tools.checkcode(1,1).result).to.equal(new Error("no antennas in range"));
        });
        it.only("same place there is antennas",function () {
            expect(tools.checkcode(2,1).result).to.equal(tools.checkcode(2,1).expect.phase1);
        });
        it("minus place / transmission length",function () {
            expect(tools.checkcode(3,1).result).to.equal(new Error("bad input"));
        });
    });
    describe ("phase 2",function () {
        it("",function () {

        });
    });
    describe ("phase 3",function () {
        it("",function () {

        })
    });
    describe ("phase 4",function () {
        it("",function () {

        })
    });
});