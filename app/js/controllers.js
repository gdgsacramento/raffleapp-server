'use strict';

/*
 * Raffle App Controller
 */

var fb = firebase.initializeApp({
    apiKey: 'AIzaSyACzmGxAtEhVTCTLNwFEKtmoGheXc43-k8',
    authDomain: 'raffle-gdgsac.firebaseio.com',
    databaseURL: 'https://raffle-gdgsac.firebaseio.com/'
});

function RaffleController($scope) {
    $scope.raffles = [];

    var ref = fb.database().ref('/raffles');

    ref.on('value', function (dataSnapshot) {
        var raffles = dataSnapshot.val();
        console.log('Raffle object', raffles);
        console.log('cloud raffle length =', raffles.length);
        if (Object.keys(raffles).length > $scope.raffles.length) {
            addRaffle(raffles);
        } else if (Object.keys(raffles).length < $scope.raffles.length) {
            removeRaffle(raffles);
        }
    });

    ref.on('child_changed', function (childSnapshot, prevChildKey) {
        console.log('child changed');
        console.log('childsnapshot', childSnapshot.val());
        console.log('prevChildKey', prevChildKey);
        getRaffleAndUpdateParticipants(childSnapshot.val());
    });

    function removeRaffle(raffles) {
        console.log('Removing raffles based on cloud array:', raffles);
        var raffleToRemove = null;
        for (var index = 0; index < $scope.raffles.length; index++) {
            var scopeRaffle = $scope.raffles[index];
            if (!raffles[scopeRaffle._id]) {
                raffleToRemove = index;
                break;
            }
        }
        if (raffleToRemove !== null) {
            $scope.raffles.splice(raffleToRemove, 1);
        }
    }

    function addRaffle(raffles) {
        console.log('Adding raffles from array:', raffles);
        for (var prop in raffles) {
            if (!hasRaffle(prop)) {
                var newRaffle = raffles[prop];
                newRaffle._id = prop;
                $scope.raffles.push(raffles[prop]);
            }
        }
        $scope.$apply();
    }

    function hasRaffle(id) {
        for (var i = 0; i < $scope.raffles.length; i++) {
            if ($scope.raffles[i]._id === id) {
                return true;
            }
        }
        return false;
    }

    function getRaffleAndUpdateParticipants(raffle) {
        $scope.raffles.forEach(function (existingRaffle) {
            if (raffle.name === existingRaffle.name) {
                existingRaffle.participants = raffle.participants;
            }
        });
    }

    function getRaffle(id) {
        for (var i = 0; i < $scope.raffles.length; i++) {
            if ($scope.raffles[i]._id === id) {
                return $scope.raffles[i];
            }
        }
        return null;
    }

    function raffleHasParticipant(raffle, name) {
        return Object.keys(raffle).indexOf(name) >= 0;
    }

    $scope.createTicket = function (name, id) {
        var raffle = getRaffle(id);
        if (!raffle.participants) {
            raffle.participants = {};
        }
        if (!raffleHasParticipant(raffle, name)) {
            console.log('Adding a ticket %s to raffle %s', name, raffle);
            var firebaseRaffle = fb.database().ref('/raffles/' + id + '/participants');
            var ticketRef = firebaseRaffle.push();
            ticketRef.set({name: name});
        }
    };

    $scope.createRaffle = function () {
        if (!$scope.raffle || !$scope.raffle.name || $scope.raffle.name === "") {
            return;
        }
        ref.push($scope.raffle, function (error) {
            if (error) {
                console.log('Synchronization failed');
            } else {
                $scope.$apply();
            }
        });
    };

    $scope.deleteRaffle = function (raffle) {
        var firebaseRaffle = fb.database().ref('raffles/' + raffle._id);
        firebaseRaffle.remove(function (error) {
            if (error) {
                console.log('Synchronization failed');
            } else {
                $scope.$apply();
            }
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
        raffle.winners = angular.copy(getTicketNames(raffle.participants));
        shuffleArray(raffle.winners);
        $scope.$apply();
    };

    function getTicketNames(raffle) {
        var result = [];
        for (var ticket in raffle) {
            result.push(ticket.name);
        }
        return result;
    }

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
