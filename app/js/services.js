'use strict';

var raServices = angular.module('ra.services', []);

raServices.factory('restService', ['$http', '$location', function(http, location) {

    /*
    Always pass authentication headers.
     */
    http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode( localStorage.id + ':' + localStorage.token);

    var redirectOnAuthFailed = function() {
        location.path("/landing");
    };

    /*
     * Could use $resources to abstract $http if needed
     * http://docs.angularjs.org/api/ngResource.$resource
     */
    return {
        getRaffle:function(onSuccess) {
            http.get('/api/v1/raffle')
                .success(function(data) {
                    onSuccess(data);
                })
                .error(redirectOnAuthFailed);
        },
        postRaffle:function(raffle, onSuccess) {

            http.post('/api/v1/raffle', raffle)
                .success(function(data) {
                    onSuccess(data);
                })
                .error(redirectOnAuthFailed);
        },
        deleteRaffle:function(raffle, onSuccess) {

            http.delete('/api/v1/raffle/' + raffle._id)
                .success(function(data) {
                    onSuccess(data);
                 })
                .error(redirectOnAuthFailed);
        },
        postTicket:function(ticket, onSuccess) {

            http.post('/api/v1/ticket', ticket)
                .success(function(data) {
                    onSuccess(data);
                })
                .error(redirectOnAuthFailed);
        },
        getUserInfo:function(onSuccess) {
            http.get('/api/v1/user')
                .success(function(data) {
                    onSuccess(data);
                })
                .error(redirectOnAuthFailed);
        },
        signOutUser:function() {
            http.post('/api/v1/signout')
                .success(function() {
                    location.path("/landing");
                });
        }
    };
}]);
