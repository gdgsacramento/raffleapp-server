'use strict';
const functions = require('firebase-functions');

exports.drawWinners = functions.database.ref('/raffles/{raffleId}/drawn')
    .onWrite(event => {
        return event.data.ref.parent.child('participants').once('value')
            .then(snapshot => {
                let winners = getTicketNames(snapshot.val());
                shuffleArray(winners);
                return event.data.ref.parent.child('winners').set(winners);
            });
    });

function getTicketNames(raffle) {
    var result = [];
    for (var ticket in raffle) {
        result.push(raffle[ticket].name);
    }
    return result;
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {

    for (var i = array.length - 1; i > 0; i--) {

        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
