'use strict';

ra.controller("LoginController", ["$scope", "$firebaseAuth", "Administrators",
    function ($scope, $firebaseAuth, Administrators) {
        $scope.auth = $firebaseAuth();

        $scope.signIn = function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            $scope.auth.$signInWithPopup(provider);
        };

        $firebaseAuth().$onAuthStateChanged(function (user) {
            $scope.firebaseUser = user;
        });

        $scope.isAdminUser = Administrators.isAdminUser;
    }
]);
