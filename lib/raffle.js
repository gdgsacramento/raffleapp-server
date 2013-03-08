
var mongo = require('./mongo');
var fn = require('./functions');
var COLLECTION_NAME = "raffle";

/**
 * Inserts the raffle passed in.
 *
 * @param raffle The raffle object.
 * @param callback(err, raffle) Passes the newly created raffle including mongo id.
 */
exports.createRaffle = function(raffle, callback) {

    mongo.collection(COLLECTION_NAME, function(collection) {

        collection.insert(raffle, function(err, doc) {
            if(err) {
                callback(err);
            }
            else {
                callback(null, doc[0]);
            }
        });
    });
};

/**
 * Deletes a raffle using the mongo id passed in.
 *
 * @param raffleId - The raffle id to delete
 * @param callback(err) If there is an error.
 */
exports.deleteRaffle = function(raffleId, callback) {

    mongo.collection(COLLECTION_NAME, function(collection) {

        var objectId = mongo.objectID(raffleId);

        collection.remove({_id : objectId}, function(err, doc) {
            if(err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    });
}

/**
 * Gets all raffles in the system (limit 100).
 * @param callback(err, raffles)
 */
exports.getRaffles = function(callback) {

    mongo.collection(COLLECTION_NAME, function(collection) {

        var cursor = collection.find({}).limit(100);
        cursor.toArray(function(err, result) {

            if(err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    });
}

/**
 * Adds a ticket to the raffle document.
 *
 * @param raffleId The raffle id.
 * @param ticket The ticket to add
 * @param callback(err)
 */
exports.createTicket = function(raffleId, ticket, callback) {

    var objectId = mongo.objectID(raffleId);
    mongo.collection(COLLECTION_NAME, function(collection) {

        collection.update({_id : objectId}, { $push : { tickets : ticket} }, function(err, result) {

            if(err) {
                callback(err);
            }
            else {
                callback(null);
            }
        });
    });
}

/**
 * Gets the winner of the raffle.  Returns a list of shuffled tickets.
 *
 * @param raffleId The raffle to shuffle tickets on.
 * @param callback(err, tickets)
 */
exports.getWinner = function(raffleId, callback) {

    var objectId = mongo.objectID(raffleId);

    mongo.collection(COLLECTION_NAME, function(collection) {

        var cursor = collection.find({_id : objectId},{tickets : 1, _id : 0});

        cursor.toArray(function(err, result) {

            if(err) {
                callback(err);
            }
            else {
                var tickets = result[0].tickets;

                // Randomize tickets
                //fn.fisherYates(tickets);
                fn.shuffleArray(tickets);
                callback(null, tickets);
            }
        });
    });
}

