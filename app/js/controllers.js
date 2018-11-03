'use strict';

/*
 * Raffle App Controller
 */

var fb = firebase.initializeApp({
    apiKey: 'AIzaSyACzmGxAtEhVTCTLNwFEKtmoGheXc43-k8',
    authDomain: 'raffle-gdgsac.firebaseapp.com',
    databaseURL: 'https://raffle-gdgsac.firebaseio.com/'
});

function RaffleController($scope, Administrators) {
    $scope.raffles = [];

    var ref = fb.database().ref('/raffles');

    ref.on('value', function (dataSnapshot) {
        var raffles = dataSnapshot.val();
        if (raffles && Object.keys(raffles).length > $scope.raffles.length) {
            addRaffle(raffles);
        } else if (raffles && Object.keys(raffles).length < $scope.raffles.length) {
            removeRaffle(raffles);
        }
    });

    ref.on('child_changed', function (childSnapshot, prevChildKey) {
        getRaffleAndUpdateParticipants(childSnapshot.val());
    });

    function removeRaffle(raffles) {
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
                existingRaffle.winners = removeDuplicates(raffle.winners);
                $scope.$apply();
            }
        });
    }

    function removeDuplicates(arr) {
        return arr.filter(function(item, pos, self) {
            return (self.indexOf(item) == pos) && (item != '');
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
            var firebaseRaffle = fb.database().ref('/raffles/' + id + '/participants');
            var ticketRef = firebaseRaffle.push();
            ticketRef.set({name: name});
        }
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

    $scope.drawWinners = function (raffleId) {
        // Randomize tickets fn.fisherYates(tickets);
        let raffleRef = fb.database().ref('raffles/' + raffleId);
        raffleRef.update({drawn: true});
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

    $scope.isAdminUser = Administrators.isAdminUser;
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

//RaffleController.$inject = ['$scope', 'socket'];
UserController.$inject = ['$scope', 'restService'];
//RaffleController.$inject = ['$scope', 'mockRestService'];
