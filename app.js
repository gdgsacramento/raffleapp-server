
var restify = require('restify');
var www = require('./lib/www');
//var raffleapprest = require('./lib/raffleapp-rest');
var SERVER = require('config').SERVER;
require('./config/config-override').init();


var server = restify.createServer({
    name : "Raffle App Server",
    version : "0.0.1-a"
});


/*
 * Serve static content
 */
server.get('\/.*', www.serveV1);

/*
 * Starting the server
 */
server.listen(SERVER.PORT, SERVER.HOSTNAME, function () {
    console.log('%s listening at %s', server.name, server.url);
});


