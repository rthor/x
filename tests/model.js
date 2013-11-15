var chai  = require('chai'),
	should = chai.should(),
	X = require('../build/x');

describe("Model", function() {
	var model = new X.Model();
	it("X should have a Model", function() {
		X.Model.should.exist;
		model.should.be.an.instanceof( X.Model );
	});
	it("Should be restful by default", function() {
		model.restful.should.be.ok;
	});
	it("Should have an data object", function() {
		model.data.should.exist;
		model.data.should.be.an('Object');
	});
});