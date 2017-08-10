'use strict';

/*
 * http://docs.angularjs.org/guide/module
 */

// Declare app level module which depends on filters, services, and directives
var ra = angular.module('ra', ['ra.filters', 'ra.services', 'ra.directives', 'ra.mock.services', 'ngRoute', 'firebase']);
ra.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/raffle.html', controller: RaffleController});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: RaffleController});
    $routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
}]);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function () {
            console.log('Service Worker Registered');
        });
}
