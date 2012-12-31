var request = require('request');
var should = require('should');
var server;
var SERVER_CONFIG = require('config').SERVER;

/*
Tests the REST CRUD for raffle
 */
describe('Test raffle CRUD', function() {

    var raffleId;

    it('should list no raffles', function(done) {
        request.get({url:'http://localhost:'+SERVER_CONFIG.PORT+'/api/v1/raffle', json:true}, function(err, res, body) {
            var raffleArray = body;
            raffleArray.should.have.lengthOf(0);
            done();
        });
    });

    it('should create one raffle', function(done) {
        request.post({url:'http://localhost:'+SERVER_CONFIG.PORT+'/api/v1/raffle',json:{raffle_name:"test raffle"}}, function(err, res, body) {
            body.should.have.lengthOf(1);
            var raffle = body[0];
            raffleId = raffle._id;
            raffle.should.have.property('name');
            raffle.should.have.property('_id');
            "test raffle".should.equal(raffle.name);
            done();
        });
    });

    it('should list the newly created raffle', function(done) {
        request.get({url:'http://localhost:'+SERVER_CONFIG.PORT+'/api/v1/raffle', json:true}, function(err, res, body) {
            var raffleArray = body;
            raffleArray.should.have.lengthOf(1);
            done();
        });
    });

    it('should delete the new raffle', function(done) {
        request.del({url:'http://localhost:'+SERVER_CONFIG.PORT+'/api/v1/raffle/'+raffleId, json:true}, function(err, res, body) {
            res.statusCode.should.equal(200);
            done();
        });
    });

    it('should list no raffles again', function(done) {
        request.get({url:'http://localhost:'+SERVER_CONFIG.PORT+'/api/v1/raffle', json:true}, function(err, res, body) {
            var raffleArray = body;
            raffleArray.should.have.lengthOf(0);
            done();
        });
    });

});




