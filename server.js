
var restify = require('restify');
var www = require('./lib/www');
var mongo = require('./lib/mongo');
var socketio = require('socket.io');
var raffleappsocketio = require('./lib/raffleapp-socketio');
var raffleapprest = require('./lib/raffleapp-rest');
var SERVER = require('config').SERVER;
require('./config/config-override').init();


var server = restify.createServer({
    name : "Raffle App Server",
    version : "0.0.1-a"
});

/**
 * Init socket io routes
 */
var io = socketio.listen(server);
io.set('log level', 1); // reduce logging
raffleappsocketio.routes(io);
/**
 * Init REST routes
 */
raffleapprest.routes(server);

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


