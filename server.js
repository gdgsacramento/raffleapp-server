
var restify = require('restify');
var api = require('./lib/api');
var user = require('./lib/user');
var www = require('./lib/www');
var mongo = require('./lib/mongo');
var SERVER = require('config').SERVER;
var AUTH = require('config').AUTH;
require('./config/config-override').init();


var server = restify.createServer({
    name : "Raffle App Server",
    version : "0.0.1-a"
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.authorizationParser());
server.use(restify.queryParser({ mapParams: false }));
server.use(restify.jsonBodyParser({ mapParams: false }));

server.use(function authenticate(req, res, next) {

    if(req.url.indexOf('/api/') === 0 &&
        req.url.indexOf('/api/v1/auth') !== 0 &&
        req.url.indexOf('/api/vi/auth_client_id') !== 0 &&
        AUTH.ENABLED) {
        var username = null;
        var password = null;
        if(typeof req.authorization !== 'undefined' && typeof req.authorization.basic !== 'undefined') {
            username = req.username;
            password = req.authorization.basic.password;
        }
        user.findAccessToken(mongo.objectID(username), password, function(err, token) {
            if(token !== null && token.token === req.authorization.basic.password) {
                console.log(req.url+" authorization success");
                return next();
            } else {
                console.log(req.url+" authorization failed");
                return next(new restify.NotAuthorizedError('User is not authorized'));
            }
        });
    } else {
        return next();
    }

});

/*
 * Create a new raffle
 * POST Body: { "raffle_name" : "<raffle name>" }
 *
 * TEST: curl -H "Content-Type: application/json" -i -X POST -d '{ "raffle_name" : "GDG DevFest Rafflle" }' localhost:8080/api/v1/raffle
 */
server.post('/api/v1/raffle', api.postRaffleV1);

/*
 * Create a new raffle entry
 * POST Body: { "raffle_id" : "<raffle id>", "user_name" : "<user name>" }
 *
 * TEST: curl -H "Content-Type: application/json" -i -X POST -d '{"raffle_id":"505f78b7e6c235e253000001", "user_name":"thomas"}' localhost:8080/api/v1/ticket
 */
server.post('/api/v1/ticket', api.postTicketV1);

/*
 * Delete a raffle entry
 * URL parameter:
 * :id = Raffle Id
 *
 */
server.del('/api/v1/raffle/:id', api.deleteRaffleV1);

/*
 * Get a list of all participants. The order of particpants determins winner(s)
 * URL parameter:
 * :id = Raffle ID
 *
 * TEST: curl -i -X GET localhost:8080/api/v1/winner/505f78b7e6c235e253000001
 */
server.get('/api/v1/winner/:id', api.getWinnerV1);

/*
 * Get the list of raffles
 *
 * TEST: curl -i -X GET localhost:8080/api/v1/raffle
 */
server.get('/api/v1/raffle', api.getRaffleV1);


/**
 * Returns the CLIENT_ID for google oauth.  This is needed to make it configurable.
 */
server.get('/api/v1/auth_client_id', function(req, res, next) {
    res.send(200, {client_id:AUTH.CLIENT_ID});
    return next();
});

/**
 * Get the user information.
 */
server.get('/api/v1/user', function(req, res, next) {
    user.findUser({_id:mongo.objectID(req.username)}, function(err, user) {
        if(err) {
            console.log(err);
            res.send(500);
        } else {
            res.send(200, user);
        }
        return next();
    });
});

/**
 * Log out current user.
 */
server.post('/api/v1/signout', function(req, res, next) {
    user.removeAccessToken(mongo.objectID(req.username), function(err, number) {
        if(err) {
            console.log(err);
            res.send(500);
        } else {
            console.log('deleting '+number);
            res.send(200);
        }
        return next();
    });
});

/**
 * Google OAuth2 authentication.  This method will do the following.
 * 1) Use authorization code to get google access token.
 * 2) Get profile information from google.
 * 3) Create or update user information
 * 4) generate and return raffleapp access token and user id.
 *
 * POST Body: { "auth_code" : "4/6A9Ote_bnoyNcGatKJItg5SR_jpu.4tLyDGC9gFwVuJJVnL49Cc-qhbfoeAI" }
 */
server.post('/api/v1/auth', user.googleOAuth2);

/*
 * Serve static content
 */ 
server.get('\/.*', www.serveV1);

exports.start = function(readyCallback) {
    mongo.init(function() {

        /*
         * Starting the server
         */
        server.listen(SERVER.PORT, SERVER.HOSTNAME, function () {
            console.log('%s listening at %s', server.name, server.url);

            // callback to call when the server is ready
            if(readyCallback) {
                readyCallback();
            }
        });
    });
};

exports.close = function() {
    server.close();
};


