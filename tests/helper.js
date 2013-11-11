chai.should();
describe("Helper functions", function() {
	var h = Helper;
	describe("abstract", function() {
		var obj = { hi: 0 },
			obj2 = { me: 'John Doe', age: 25 };

		it('Should be a function', function() {
			h.abstract.should.be.a('Function');
		});
		it("Should move data from objects to `this`", function() {
			h.abstract.call(obj, 'age', obj2);
			obj.should.contain.keys('age');
			obj2.should.not.contain.keys('age');
		});
	});
});