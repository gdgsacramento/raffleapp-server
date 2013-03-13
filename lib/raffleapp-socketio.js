/**
 * For socket.io communication and routing.
 */

var raffleService = require('./raffle');

exports.routes = function(io) {
    io.sockets.on('connection', function (socket) {

        /**
         * Creates the raffle and emits 'raffleCreated' message.
         */
        socket.on('createRaffle', function(data) {
            var raffle = {};
            raffle.name = data.raffle_name;
            raffle.tickets = [];

            raffleService.createRaffle(raffle, function(err, doc) {
                if(err) {
                    console.log("error: "+err);
                } else {
                    io.sockets.emit('raffleCreated', doc);
                }
            });
        });

        /**
         * Deletes the raffle and emits 'raffleDeleted' message.
         */
        socket.on('deleteRaffle', function(data) {

            raffleService.deleteRaffle(data._id, function(err) {
                if(err) {
                    console.log("error: "+err);
                }
                else {
                    io.sockets.emit('raffleDeleted', data);
                }
            });
        });

        /**
         * Creates the ticket and emits 'ticketCreated' message.
         */
        socket.on('createTicket', function(data) {

            raffleService.createTicket(data.raffle_id, data.user_name, function(err) {
                if(err) {
                    console.log("error: "+err);
                }
                else {
                    io.sockets.emit('ticketCreated', data);
                }
            });
        });

        socket.on('getRaffles', function() {
            raffleService.getRaffles(function(err, raffles) {
                if(err) {
                    console.log("error: "+err);
                }
                else {
                    socket.emit('raffleList', raffles);
                }
            });
        });

        socket.on('drawWinners', function(data, clientCallback) {

            raffleService.getWinner(data.id, function(err, winners) {

                if(err) {

                    clientCallback(err, null);
                }
                else {

                    clientCallback(null, winners);
                }
            });
        });
    });
}

