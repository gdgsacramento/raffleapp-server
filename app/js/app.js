'use strict';

/*
 * http://docs.angularjs.org/guide/module
 */

// Declare app level module which depends on filters, services, and directives
var ra = angular.module('ra', ['ra.filters', 'ra.services', 'ra.directives', 'ra.mock.services']).
    config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/landing', {templateUrl: 'partials/landing.html', controller: LandingController});
    $routeProvider.when('/raffle', {templateUrl: 'partials/raffle.html', controller: RaffleController});
    $routeProvider.otherwise({redirectTo: '/raffle'});

    $locationProvider.html5Mode(true);
}]);
