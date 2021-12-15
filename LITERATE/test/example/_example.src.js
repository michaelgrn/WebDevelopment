'use strict';
const expect = require("chai").expect;
/**
 * This will hold like the source
 * for like tests and stuff. 
 * I should be cool? 
 **/

module.exports = {
    shouldBeTwoDigit: function () {

        expect(2).to.equal(2);
    },

    shouldBeTwoLetter: function () {
        expect('two').to.equal('two');

         // check log
    },

    shouldBeTwoJapanese: function (params) {
        params = params || "ni";
        
        expect(params).to.equal("ni");
    },

    shouldBeTwos: function (params) {
       let twos = {
           two: "two",
           TWO: "TWO"
       } 

       expect(params).to.deep.equal(twos);
        // for(let x of params) {
        //     expect(x).to.equal("two")
        // }
    },

    shouldNotBeThree: function (params) {
        params = params || '3';

        expect(params).to.equal(2);
    }
}
