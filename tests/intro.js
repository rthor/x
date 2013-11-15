var chai  = require('chai'),
	should = chai.should(),
	X = require('../build/x.npm');

describe("X", function() {
	it("Should be an Object", function() {
		X.should.be.an('object');
	});
	it("Should be restful by default", function() {
		X.restful.should.be.ok;
	});
	it("Should have a Version number", function() {
		X.Version.should.exist;
	});
});