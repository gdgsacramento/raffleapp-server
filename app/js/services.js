'use strict';

var raServices = angular.module('ra.services', []);

raServices.factory('restService', ['$http', function(http) {

    /*
     * Could use $resources to abstract $http if needed
     * http://docs.angularjs.org/api/ngResource.$resource
     */
    return {
        getRaffle:function(onSuccess) {

            http.get('/api/v1/raffle').success(function(data) {

                onSuccess(data);
            });
        },
        postRaffle:function(raffle, onSuccess) {

            http.post('/api/v1/raffle', raffle).success(function(data) {

                onSuccess(data);
            });
        },
        deleteRaffle:function(raffle, onSuccess) {

            http.delete('/api/v1/raffle/' + raffle._id).success(function(data) {

                onSuccess(data);
            });
        },
        postTicket:function(ticket, onSuccess) {

            http.post('/api/v1/ticket', ticket).success(function(data) {

                onSuccess(data);
            });
        }
    };
}]);
