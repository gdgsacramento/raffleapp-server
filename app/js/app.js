'use strict';

/*
 * http://docs.angularjs.org/guide/module
 */

// Declare app level module which depends on filters, services, and directives
var ra = angular.module('ra', ['firebase','ra.filters', 'ra.services', 'ra.directives', 'ra.mock.services', 'ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/landing', {templateUrl: 'partials/landing.html', controller: LandingController});
    $routeProvider.when('/', {templateUrl: 'partials/raffle.html', controller: RaffleController});
    $routeProvider.when('/admin', {templateUrl: 'partials/admin.html', controller: AdminController});
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
