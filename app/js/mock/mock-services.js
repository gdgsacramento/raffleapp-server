'use strict';

var raMockServices = angular.module('ra.mock.services', []);

raMockServices.factory('mockRestService', function() {

    return {
        getRaffle:function(onSuccess) {

            onSuccess([]);
        },
        postRaffle:function(raffle, onSuccess) {

            onSuccess([{ "name" : raffle.raffle_name, "tickets" : [ ], "_id" : "50ee5574e0c12e1d33000002" }]);
        },
        deleteRaffle:function(raffle, onSuccess) {

            onSuccess([]);
        },
        postTicket:function(ticket, onSuccess) {

            onSuccess([]);
        }
    };
});