var chai  = require('chai'),
	should = chai.should(),
	X = require('../build/x.test');

describe("Collection", function() {
	var col = new X.Collection({
		url: 'json/collection.json'
	});
	it("X should have a Collection", function() {
		X.Collection.should.exist;
	});
	it("Should have a list", function() {
		col.list.exist;
		col.list.should.be.an('Array');
	});
	describe("Collection.count()", function () {
		it("Should be a function", function() {
			col.count.should.be.a('Function');
		});
		it("Should return the list's length", function() {
			col.count().should.equal( 0 );
			col.list = [0, 0, 9, 5];
			col.count().should.equal( 4 );
			col.list = [];
			col.count().should.equal( 0 );
		});
	});
});