var Hapi = require('hapi');
var server = new Hapi.Server();
var Inert = require('inert');

server.connection({
    host: 'localhost',
    port: 8080
});

server.register(Inert, function (err) {
    if(err) {
        throw err;
    }
});

server.route({
    method: 'GET',
    path:'/{param*}',
    handler: {
        directory : {
            path: 'app'
        }
    }
});

server.start(function() {
    console.log("Server hath been started");
});


