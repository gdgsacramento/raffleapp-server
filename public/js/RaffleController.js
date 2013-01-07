
/*
 * http://docs.angularjs.org/guide/module
 */
var myAppModule = angular.module('myApp',[]);


function RaffleController($scope, $http) {

    var selectedRaffleIndex;

    $scope.ticket = { raffle_id: "", user_name : ""};

    $http.get('/api/v1/raffle').success(function(data) {

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

        $http.post('/api/v1/raffle', $scope.raffle).success(function(data) {

            $scope.raffles.push(data[0]);
            $scope.raffle = { raffle_name : ""};
        });
    }

    $scope.deleteRaffle = function(raffle) {

        $http.delete('/api/v1/raffle/'+raffle._id).success(function(data) {

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

        $http.post('/api/v1/ticket', $scope.ticket).success(function(data) {

            $scope.raffles[selectedRaffleIndex].tickets.push($scope.ticket.user_name);
            $scope.ticket.user_name = "";
        });
    }
}

/*
 * Dependency injection: http://docs.angularjs.org/guide/di
 */
RaffleController.$inject = ['$scope', '$http'];