var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var genev = require('../src/genev');

describe('genev(CHROMO_STRUCTURE, options)', function () {
    it("should not equal null", function() {
        expect(genev).to.not.equal(null);
    });

    it("should return null if given an invalid chromosome", function () {
        expect(genev(null)).to.equal(null);
        expect(genev({})).to.equal(null);
        expect(genev(function () {})).to.equal(null);
        expect(genev()).to.equal(null);
    });

    it("should return an object when given a valid chromosome", function () {
        // Valid argument
        var genes = {gene: null};
        expect(genev(genes)).to.be.a('object');
        expect(genev({genes: genes})).to.be.a('object');
    });

    it("should create a class that has public methods: evolve, initPopulation, resetOptions, getPopulation", function () {
        var gen = genev({gene: null});
        expect(gen.evolve).to.be.a('function');
        expect(gen.initPopulation).to.be.a('function');
        expect(gen.resetOptions).to.be.a('function');
        expect(gen.getPopulation).to.be.a('function');
    });
});