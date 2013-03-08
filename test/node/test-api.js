var should = require('should');
var request = require('request');
var SERVER_CONFIG = require('config').SERVER;


/*
 * Testing the REST CRUD for raffle
 */
describe('Test raffle CRUD', function() {

    var raffleId;
    var numberOfRaffles = 0;

    it('should list baseline raffles', function(done) {

        var options = {
            url: SERVER_CONFIG.URL + '/api/v1/raffle',
            timeout: 5000,
            json: true
        };

        console.log("Mocha hitting "+options.url);

        request.get(options, function(err, res, body) {

            res.should.have.status(200);

            var raffleArray = body;

            should.exist(raffleArray);
            raffleArray.should.be.an.instanceOf(Array);

            numberOfRaffles = raffleArray.length;

            if(raffleArray.length > 0) {

                var raffle = raffleArray[0];
                raffle.should.have.property('_id');
                raffle.should.have.property('name');
                raffle.should.have.property('tickets');
                raffle.tickets.should.be.an.instanceOf(Array);
            }

            done();
        });
    });

    it('should create one raffle', function(done) {

        var options = {
            url: SERVER_CONFIG.URL + '/api/v1/raffle',
            timeout: 5000,
            json: true,
            body: {raffle_name:"test raffle"}
        };

        request.post(options, function(err, res, body) {
            res.should.have.status(200);

            var raffle = body;
            raffleId = raffle._id;
            raffle.should.have.property('name', options.body.raffle_name);
            raffle.should.have.property('_id');

            done();
        });
    });

    it('should list the newly created raffle', function(done) {

        var options = {
            url: SERVER_CONFIG.URL + '/api/v1/raffle',
            timeout: 5000,
            json: true
        };

        request.get(options, function(err, res, body) {

            res.should.have.status(200);

            var raffleArray = body;
            raffleArray.should.have.lengthOf(numberOfRaffles + 1);

            done();
        });
    });

    it('should delete the new raffle', function(done) {

        var options = {
            url: SERVER_CONFIG.URL + '/api/v1/raffle/' + raffleId,
            timeout: 5000,
            json: true
        };

        request.del(options, function(err, res, body) {

            res.should.have.status(200);

            done();
        });
    });

    it('should list baseline raffles again', function(done) {

        var options = {
            url: SERVER_CONFIG.URL + '/api/v1/raffle',
            timeout: 5000,
            json: true
        };

        request.get(options, function(err, res, body) {

            res.should.have.status(200);

            var raffleArray = body;

            raffleArray.should.have.lengthOf(numberOfRaffles);

            done();
        });
    });

});




