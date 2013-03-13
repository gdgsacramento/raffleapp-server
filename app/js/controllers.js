'use strict';

/*
 * Raffle App Controller
 */
function RaffleController($scope, socket) {

    socket.emit("getRaffles");

    socket.on("raffleList", function(raffles) {
        $scope.raffles = raffles;
    });


    $scope.createRaffle = function() {
        if(!$scope.raffle || !$scope.raffle.raffle_name || $scope.raffle.raffle_name === "") {
            // TODO: show message
            return;
        }
        socket.emit("createRaffle", $scope.raffle);
    }

    socket.on("raffleCreated", function(raffle) {
        $scope.raffles.push(raffle);
        $scope.raffle = { raffle_name : ""};
    });

    $scope.deleteRaffle = function(raffle) {
        socket.emit("deleteRaffle", raffle);
    }

    socket.on("raffleDeleted", function(raffle) {
        raffle = $scope.findRaffleById(raffle._id);
        $scope.raffles.splice($scope.raffles.indexOf(raffle), 1); //indexOf not supported on IE
    });


    $scope.createTicket = function(name, id, index) {

        var ticket = {
            'raffle_id' : id,
            'user_name' : name
        };

        socket.emit("createTicket", ticket);
    }

    socket.on("ticketCreated", function(ticket) {
        var raffle = $scope.findRaffleById(ticket.raffle_id);
        raffle.tickets.push(ticket.user_name);
        $scope.userName = "";
    });

    $scope.findRaffleById = function(raffleId) {
        for(var i=0; i<$scope.raffles.length; i++) {
            var raffle = $scope.raffles[i];
            if(raffle._id === raffleId) {
                return raffle;
            }
        }
        return null;
    }

    $scope.drawWinners = function(raffle) {

        socket.emit("drawWinners", {'id':raffle._id}, function(err, data) {

            if(err) {

                console.error("ERRRO: Was not able to draw winners");
            }
            else {

                raffle.winners = data;
            }
        });
    };
}

function UserController($scope, restService) {
    if(localStorage.id) {
        restService.getUserInfo(function(data) {
            $scope.user = data;
        });
    } else {
        $scope.user = {name:"Test Mode"};
    }

    $scope.signOutUser = function() {
        restService.signOutUser();
    }
}

function LandingController($scope, $location, restService) {

    restService.getOAuthClientId(function(data) {
        $scope.clientId = data.client_id;
    });

    $scope.serverUrl = $location.absUrl().split('landing')[0];

}

LandingController.$inject = ['$scope', '$location', 'restService'];
RaffleController.$inject = ['$scope', 'socket'];
UserController.$inject = ['$scope', 'restService'];
//RaffleController.$inject = ['$scope', 'mockRestService'];
