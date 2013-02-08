'use strict';

/*
 * Raffle App Controller
 */
function RaffleController($scope, restService) {

    var selectedRaffleIndex;

    $scope.ticket = { raffle_id: "", user_name : ""};

    restService.getRaffle(function(data) {

        $scope.raffles = data;
    });

    $scope.selectRaffle = function(raffleId, raffleIndex) {

        $scope.ticket.raffle_id = raffleId;

        /*
         * Reset selected raffle background color
         */
        if(selectedRaffleIndex !== undefined) {

            $scope.raffles[selectedRaffleIndex].isSelectedClass = "";
        }

        /*
         * Change selected raffle's background color
         */
        if(raffleIndex === selectedRaffleIndex) {

            $scope.raffles[raffleIndex].isSelectedClass = "";
            selectedRaffleIndex = undefined;
        }
        else {

            $scope.raffles[raffleIndex].isSelectedClass = "select-raffle";
            selectedRaffleIndex = raffleIndex;
        }
    };

    $scope.createRaffle = function() {

        if(!$scope.raffle || !$scope.raffle.raffle_name || $scope.raffle.raffle_name === "") {

            // TODO: show message
            return;
        }

        restService.postRaffle($scope.raffle, function(data) {

            $scope.raffles.push(data[0]);
            $scope.raffle = { raffle_name : ""};
        });
    }

    $scope.deleteRaffle = function(raffle) {

        restService.deleteRaffle(raffle, function(data) {

            /*
             * Reset selected raffle background color
             */
            if(selectedRaffleIndex || 0 === selectedRaffleIndex) {

                $scope.raffles[selectedRaffleIndex].isSelectedClass = "";
                selectedRaffleIndex = undefined;
            }

            $scope.raffles.splice($scope.raffles.indexOf(raffle), 1); //indexOf not supported on IE
        });
    }

    $scope.createTicket = function() {


        /*
         * Check for missing ticket name
         */
        if(!$scope.ticket.user_name || $scope.ticket.user_name === "") {

            // TODO: Show message
            return;
        }

        /*
         * If the user didn't select a raffle, we don't do anything
         */
        if(selectedRaffleIndex === undefined) {
            // TODO: Show message
            return;
        }

        restService.postTicket($scope.ticket, function(data) {

            $scope.raffles[selectedRaffleIndex].tickets.push($scope.ticket.user_name);
            $scope.ticket.user_name = "";
        });
    }
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
RaffleController.$inject = ['$scope', 'restService'];
UserController.$inject = ['$scope', 'restService'];
//RaffleController.$inject = ['$scope', 'mockRestService'];
