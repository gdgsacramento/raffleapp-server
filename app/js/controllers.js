'use strict';

/*
 * Raffle App Controller
 */
function RaffleController($scope, $mdDialog) {
    $scope.raffles = [];
    var initialCall = true;

    var firebase = new Firebase('https://raffle-gdgsac.firebaseio.com/raffles');

    firebase.on('value', function (dataSnapshot) {

        $scope.raffles = dataSnapshot.val();
        if ($scope.raffles === null) {
            console.log('Resetting raffles');
            $scope.raffles = [];
        }

        if (initialCall) {
            $scope.$apply();
            initialCall = false;
        }
    });

    $scope.createRaffle = function () {
        if (!$scope.raffle || !$scope.raffle.name || $scope.raffle.name === "") {
            return;
        }
        $scope.raffle.participants = [];
        firebase.push($scope.raffle, function (error) {
            if (error) {
                console.log('Synchronization failed');
            } else {
                $scope.raffle.name = '';
                $scope.$apply();
            }
        });
    };

    function getKeyByRaffle(raffle) {
        var key = '';
        for (var tmpKey in $scope.raffles) {
            if ($scope.raffles[tmpKey] === raffle) {
                key = tmpKey;
            }
        }
        return key;
    }

    function showAlert(name) {
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Error creating Ticket')
                .content("A user named " + name + " has already entered the raffle")
                .ariaLabel('Error creating Ticket')
                .ok('Got it!')
        );
    }

    $scope.createTicket = function (name, raffle) {
        if (!raffle.participants) {
            raffle.participants = [];
        }

        var nameAlreadyExists = false;
        for (var i = 0; i < raffle.participants.length; i++) {
            if (raffle.participants[i] === name) {
                nameAlreadyExists = true;
            }
        }

        if (nameAlreadyExists) {
            showAlert(name);
        } else {
            var key = getKeyByRaffle(raffle);

            raffle.participants.push(name);
            $scope.raffles[key] = raffle;
            firebase.update($scope.raffles, function (error) {
                if (error) {
                    console.log('Synchronization failed');
                } else {
                    $scope.nameError = '';
                }
            });
        }
    };

    $scope.deleteRaffle = function (raffle) {
        var confirmDialog = $mdDialog.confirm()
            .title("Delete Raffle?")
            .content("Are you sure you want to delete " + raffle.name + "?")
            .ariaLabel("Delete Raffle?")
            .ok("Delete")
            .cancel("Cancel");

        $mdDialog.show(confirmDialog).then(function () {
            var key = getKeyByRaffle(raffle);

            firebase.child(key).remove();
        });
    };

    $scope.findRaffleById = function (raffleId) {
        for (var i = 0; i < $scope.raffles.length; i++) {
            var raffle = $scope.raffles[i];
            if (raffle._id === raffleId) {
                return raffle;
            }
        }
        return null;
    };

    $scope.drawWinners = function (raffle) {
        // Randomize tickets fn.fisherYates(tickets);
        raffle.winners = angular.copy(raffle.participants);
        shuffleArray(raffle.winners);
    };

    /**
     * Randomize array element order in-place.
     * Using Fisher-Yates shuffle algorithm.
     */
    function shuffleArray(array) {

        for (var i = array.length - 1; i > 0; i--) {

            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

function UserController($scope, restService) {
    if (localStorage.id) {
        restService.getUserInfo(function (data) {
            $scope.user = data;
        });
    } else {
        $scope.user = {name: "Test Mode"};
    }

    $scope.signOutUser = function () {
        restService.signOutUser();
    }
}

function LandingController($scope, $location, restService) {

    restService.getOAuthClientId(function (data) {
        $scope.clientId = data.client_id;
    });

    $scope.serverUrl = $location.absUrl().split('landing')[0];

}

LandingController.$inject = ['$scope', '$location', 'restService'];
//RaffleController.$inject = ['$scope', 'socket'];
UserController.$inject = ['$scope', 'restService'];
//RaffleController.$inject = ['$scope', 'mockRestService'];
