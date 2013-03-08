/**
 * For REST communication and routing.
 */
var restify = require('restify');
var raffleService = require('./raffle');
var user = require('./user');
var mongo = require('./mongo');
var AUTH = require('config').AUTH;



exports.routes = function(server) {
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.authorizationParser());
    server.use(restify.queryParser({ mapParams: false }));
    server.use(restify.jsonBodyParser({ mapParams: false }));

    /*
     * On each REST API access, we validate user authorization
     */
    server.use(function authenticate(req, res, next) {

        if(req.url.indexOf('/api/') === 0 &&
            req.url.indexOf('/api/v1/auth') !== 0 &&
            req.url.indexOf('/api/vi/auth_client_id') !== 0 &&
            AUTH.ENABLED) {


            if(!req.authorization || !req.authorization.basic || !req.authorization.basic.username || !req.authorization.basic.password) {

                console.log("WARN: Missing authorization information");
                res.send(403);
                return;
            }

            var username = req.authorization.basic.username;
            var password = req.authorization.basic.password;

            user.findAccessToken(mongo.objectID(username), password, function(err, token) {

                if(token !== null && token.token === req.authorization.basic.password) {

                    return next();
                }
                else {

                    return next(new restify.NotAuthorizedError('User is not authorized'));
                }
            });
        }
        else {

            return next();
        }
    });

    /*
     * Create a new raffle
     * POST Body: { "raffle_name" : "<raffle name>" }
     *
     * TEST: curl -H "Content-Type: application/json" -i -X POST -d '{ "raffle_name" : "GDG DevFest Rafflle" }' localhost:8080/api/v1/raffle
     */
    server.post('/api/v1/raffle', function(req, res, next) {
        if(!req.body || !req.body.raffle_name) {

            console.log("ERROR: Missing POST body data");
            res.send(404);
            return next();
        }
        var raffle = {};
        raffle.name = req.body.raffle_name;
        raffle.tickets = [];

        raffleService.createRaffle(raffle, function(err, doc) {
            if(err) {
                res.send(500);
            } else {
                res.send(200, doc);
            }
            return next();
        });
    });

    /*
     * Create a new raffle entry
     * POST Body: { "raffle_id" : "<raffle id>", "user_name" : "<user name>" }
     *
     * TEST: curl -H "Content-Type: application/json" -i -X POST -d '{"raffle_id":"505f78b7e6c235e253000001", "user_name":"thomas"}' localhost:8080/api/v1/ticket
     */
    server.post('/api/v1/ticket', function(req, res, next) {
        if(!req.body || !req.body.raffle_id || !req.body.user_name) {

            console.log("ERROR: Missing POST body data");
            res.send(404);
            return next();
        }

        raffleService.createTicket(req.body.raffle_id, req.body.user_name, function(err) {
            if(err) {
                res.send(500);
            }
            else {
                res.send(200);
            }

            return next();
        });
    });

    /*
     * Delete a raffle entry
     * URL parameter:
     * :id = Raffle Id
     *
     */
    server.del('/api/v1/raffle/:id',  function(req, res, next) {
        if(!req.params.id) {

            console.log("ERROR: Missing url parameter id");
            res.send(404);
            return next();
        }

        raffleService.deleteRaffle(req.params.id, function(err) {
            if(err) {
                res.send(500);
            }
            else {
                res.send(200);
            }

            return next();
        });
    });

    /*
     * Get a list of all participants. The order of particpants determins winner(s)
     * URL parameter:
     * :id = Raffle ID
     *
     * TEST: curl -i -X GET localhost:8080/api/v1/winner/505f78b7e6c235e253000001
     */
    server.get('/api/v1/winner/:id', function(req, res, next) {

        if(!req.params.id) {

            console.log("ERROR: Missing url parameters");
            res.send(404);
            return next();
        }

        raffleService.getWinner(req.params.id, function(err, doc) {
            if(err) {
                res.send(500);
            }
            else {
                res.json(200, doc);
            }

            return next();
        });
    });

    /*
     * Get the list of raffles
     *
     * TEST: curl -i -X GET localhost:8080/api/v1/raffle
     */
    server.get('/api/v1/raffle',  function(req, res, next) {

        raffleService.getRaffles(function(err, doc) {
            if(err) {
                res.send(500);
            }
            else {
                res.json(200, doc);
            }

            return next();
        });
    });


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
     * Google OAuth2 authentication.  This method will do the following.
     * 1) Use authorization code to get google access token.
     * 2) Get profile information from google.
     * 3) Create or update user information
     * 4) generate and return raffleapp access token and user id.
     *
     * POST Body: { "auth_code" : "4/6A9Ote_bnoyNcGatKJItg5SR_jpu.4tLyDGC9gFwVuJJVnL49Cc-qhbfoeAI" }
     */
    server.post('/api/v1/auth', user.googleOAuth2);

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



}




