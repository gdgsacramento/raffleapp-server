var should = require('should');
var crypto = require('crypto');
var mongo = require('../../lib/mongo');
var user = require('../../lib/user');

/*
 * Testing the user functions
 */
describe('Test user functions', function() {


    before(function(done) {
        mongo.init(done);
    });

    beforeEach(function(done) {
        removeAllAccessTokens(function() {
            removeAllUsers(function() {
                done();
            });
        });
    });

    it('should return null for empty users', function(done) {
        user.findUser({id:1}, function(err, newUser) {
            should.not.exist(err);
            should.not.exist(newUser);
            done();
        });
    });

    it('should create a user', function(done) {
        user.upsertUser({id:23, given_name:'John'}, function(err, newUser){
            should.not.exist(err);
            should.exist(newUser);
            user.findUser({id:23}, function(err, newUser) {
                should.not.exist(err);
                should.exist(newUser);
                done();
            });
        });
    });

    it('should return error for old token', function(done) {
        user.googleAuth('4/D5q3D5vGNGsz-Gp_Z4S559zdjk9L.ovcpsamrlr0ZuJJVnL49Cc9ej6rneAI', function(err, access_code) {
            should.exist(err);
            should.not.exist(access_code);
            done();
        });
    });

    it('should return error for invalid access token', function(done) {
        user.googleProfile('invalid_token', function(err, userObject) {
            should.exist(err);
            should.not.exist(userObject);
            done();
        });
    });

    it('should insert new access token', function(done) {
        user.upsertAccessToken('user-id', function(err, accessToken){
            should.not.exist(err);
            should.exist(accessToken);
            user.findAccessToken('user-id', accessToken.token, function(err, access_token) {
                should.not.exist(err);
                should.exist(access_token);
                done();
            });
        });
    });

    it('should update an access token', function(done) {
        var firstToken = null;
        user.findAccessToken('user-id', 'token', function(err, access_token) {
            should.not.exist(err);
            should.not.exist(access_token);

            user.upsertAccessToken('user-id', function(err, accessToken){
                should.not.exist(err);
                should.exist(accessToken);
                firstToken = accessToken.token;

                user.findAccessToken('user-id', firstToken, function(err, access_token) {
                    should.not.exist(err);
                    should.exist(access_token);

                    user.upsertAccessToken('user-id', function(err, accessToken){
                        should.not.exist(err);

                        user.findAccessToken('user-id', firstToken, function(err, access_token) {
                            should.not.exist(err);
                            should.not.exist(access_token);
                            done();
                        });
                    });
                });
            });
        });
    });

});

var removeAllUsers = function(callback) {
    mongo.collection('user', function(collection) {
        collection.remove({}, function(err, doc) {
            if(err) {
                console.log(err);
            }
            callback();
        });
    });
};

var removeAllAccessTokens = function(callback) {
    mongo.collection('access_token', function(collection) {
        collection.remove({}, function(err, doc) {
            if(err) {
                console.log(err);
            }
            callback();
        });
    });
};




