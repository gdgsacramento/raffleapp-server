'use strict';

var raServices = angular.module('ra.services', []);

raServices.factory('socket', ['$rootScope',function (rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                console.log("client received socket.io "+eventName, arguments[0]);
                var args = arguments;
                rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            console.log("client sending socket.io "+ eventName+" data is ",data);
            socket.emit(eventName, data, function () {
                var args = arguments;
                rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
}]);

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
        getOAuthClientId:function(onSuccess) {
            http.get('/api/v1/auth_client_id')
                .success(function(data) {
                    onSuccess(data);
                });
        },
        signOutUser:function() {
            http.post('/api/v1/signout')
                .success(function() {
                    location.path("/landing");
                });
        }
    };
}]);
