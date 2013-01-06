var fn = require('../../lib/functions');
var should = require('should');

/*
 * Test functions
 */
describe('Test randomizing array using shuffleArray()', function() {

    var a = ['a', 'b', 'c', 'd', 'e', 'f'];
    var b = ['a', 'b', 'c', 'd', 'e', 'f'];

    it('should have equal arrays before shuffling one the arrays', function() {

        a.should.eql(b);
    });

    it('should have equal length', function() {

        fn.shuffleArray(a);

        a.should.have.lengthOf(b.length);
    });

    it('should not be equal', function() {

        a.should.not.eql(b);
    });
});


describe('Test randomizing array using fisherYates()', function() {

    var a = ['a', 'b', 'c', 'd', 'e', 'f'];
    var b = ['a', 'b', 'c', 'd', 'e', 'f'];

    it('should have equal arrays before shuffling one the arrays', function() {

        a.should.eql(b);
    });

    it('should have equal length', function() {

        fn.fisherYates(a);

        a.should.have.lengthOf(b.length);
    });

    it('should not be equal', function() {

        a.should.not.eql(b);
    });
});


