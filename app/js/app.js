'use strict';

/*
 * http://docs.angularjs.org/guide/module
 */

// Declare app level module which depends on filters, services, and directives
var ra = angular.module('ra', ['ra.filters', 'ra.services', 'ra.directives', 'ra.mock.services', 'ngRoute']);
ra.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/landing', {templateUrl: 'partials/landing.html', controller: LandingController});
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

    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
        /*Notification.requestPermission(function (result) {
            if (result === 'denied') {
                console.log('Permission wasn\'t granted.');
                return;
            } else if (result === 'default') {
                console.log('The permission request was dismissed.');
                return;
            }
            console.log('Permission was granted for notifications');
            console.log('Service worker is ready!');
            console.log('Service worker registration:', JSON.stringify(serviceWorkerRegistration));
            var options = {
                "body": "Did you make a $1,000,000 purchase at Dr. Evil...",
                "icon": "images/icons/icon-32x32.png",
                "vibrate": [200, 100, 200, 100, 200, 100, 400],
                "tag": "request",
                "actions": [
                    {"action": "yes", "title": "Yes", "icon": "images/icons/icon-32x32.png"},
                    {"action": "no", "title": "No", "icon": "images/icons/icon-32x32.png"}
                ]
            };
            serviceWorkerRegistration.showNotification('Service worker ready!', options);
        });*/
    });
}
