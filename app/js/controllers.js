'use strict';

/*
 * Raffle App Controller
 */

var fb = firebase.initializeApp({
    apiKey: 'AIzaSyACzmGxAtEhVTCTLNwFEKtmoGheXc43-k8',
    authDomain: 'raffle-gdgsac.firebaseio.com',
    databaseURL: 'https://raffle-gdgsac.firebaseio.com/'
});

function RaffleController($scope, $firebaseArray) {
    var ref = fb.database().ref('/raffles');
    $scope.raffles = $firebaseArray(ref);
    console.log($scope.raffles);

    var firstUpdate = true;

    // var ref = fb.database().ref('/raffles');

    // ref.on('value', function (dataSnapshot) {
    //     var raffles = dataSnapshot.val();
    //     console.log('Raffle object', raffles);
    //     $scope.raffles = [];
    //     for (var prop in raffles) {
    //         var newRaffle = raffles[prop];
    //         newRaffle.$id = prop;
    //         $scope.raffles.push(newRaffle);
    //     }

    //     $scope.$apply();
    // });

    function getRaffle(name) {
        for (var i = 0; i < $scope.raffles.length; i++) {
            if ($scope.raffles[i].$id === name) {
                return $scope.raffles[i];
            }
        }
        return null;
    }

    function raffleHasParticipant(raffle, name) {
        var foundName = false;
        raffle.participants.forEach(function (existingName) {
            if (existingName.toLowerCase() === name.toLowerCase()) {
                foundName = true;
            }
        });
        return foundName;
    }

    $scope.createTicket = function (name, id) {
        var raffle = getRaffle(id);
            raffle.participantsRef = fb.database().ref('/raffles/' + id + '/participants');
            raffle.participants = $firebaseArray(raffle.participantsRef);
            raffle.participants.$add({
              name: name
            });
    };

    $scope.createRaffle = function () {
        if (!$scope.raffle || !$scope.raffle.name || $scope.raffle.name === "") {
            return;
        }
        
        ref.push($scope.raffle, function (error) {
            if (error) {
                console.log('Synchronization failed');
            }
        });
    };

    $scope.deleteRaffle = function (raffle) {
        var firebaseRaffle = fb.database().ref('raffles/' + raffle.$id);
        firebaseRaffle.remove(function (error) {
            if (error) {
                console.log('Synchronization failed');
            }
        });
    };

    $scope.findRaffleById = function (raffleId) {
        for (var i = 0; i < $scope.raffles.length; i++) {
            var raffle = $scope.raffles[i];
            if (raffle.$id === raffleId) {
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
        $scope.clientId = data.client$id;
    });

    $scope.serverUrl = $location.absUrl().split('landing')[0];

}

LandingController.$inject = ['$scope', '$location', 'restService'];
//RaffleController.$inject = ['$scope', 'socket'];
UserController.$inject = ['$scope', 'restService'];
//RaffleController.$inject = ['$scope', 'mockRestService'];
