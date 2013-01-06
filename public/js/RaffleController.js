
/*
 * http://docs.angularjs.org/guide/module
 */
var myAppModule = angular.module('myApp',[]);


function RaffleController($scope, $http) {

    var selectedRaffleIndex = 0;
    $scope.ticket = { raffle_id: "", user_name : ""};

    $http.get('/api/v1/raffle').success(function(data) {

        /*
         * Init isSelected for CSS selection background color
         */
        for(var i = 0; i < data.length; i++) {

            data[i].isSelected = "not";
        }

        $scope.raffles = data;
    });

    $scope.selectRaffle = function(raffleId, raffleIndex) {

        $scope.ticket.raffle_id = raffleId;
        selectedRaffleIndex = raffleIndex;

        /*
         * Reset selected raffle background color
         */
        for(var i = 0; i < $scope.raffles.length; i++) {

            $scope.raffles[i].isSelected = "not";
        }

        /*
         * Change selected raffle's background color
         */
        $scope.raffles[selectedRaffleIndex].isSelected = "is";
    };

    $scope.createRaffle = function() {

        $http.post('/api/v1/raffle', $scope.raffle).success(function(data) {

            $scope.raffles.push(data[0]);
            $scope.raffle = { raffle_name : ""};
        });
    }

    $scope.deleteRaffle = function(raffle) {

        $http.delete('/api/v1/raffle/'+raffle._id).success(function(data) {

            $scope.raffles.splice($scope.raffles.indexOf(raffle), 1); //indexOf not supported on IE
        });
    }

    $scope.createTicket = function() {

        console.log($scope.ticket.user_name);

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