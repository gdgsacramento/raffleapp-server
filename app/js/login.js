'use strict';

ra.controller("LoginController", ["$scope", "$firebaseAuth",
    function ($scope, $firebaseAuth) {
        $scope.auth = $firebaseAuth();

        $scope.signIn = function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            $scope.auth.$signInWithPopup(provider);
        };

        $scope.auth.$onAuthStateChanged(function (firebaseUser) {
            $scope.firebaseUser = firebaseUser;
        });
    }
]);
