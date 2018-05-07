const functions = require('firebase-functions');

exports.drawWinners = functions.database.ref('/raffles/{raffleId}/drawn')
    .onWrite(change => {
        if (change.before.val()) {
            return Promise.resolve();
        }

        return change.after.ref.parent.child('participants').once('value')
            .then(snapshot => {
                let winners = getTicketNames(snapshot.val());
                shuffleArray(winners);
                return change.after.ref.parent.child('winners').set(winners);
            })
            .catch(err => {
                return change.after.ref.parent.child('winners').set(['Error drawing winners: ' + err.message]);
            });
    });

function getTicketNames(raffle) {
    let result = [];
    for (let ticket in raffle) {
        result.push(raffle[ticket].name);
    }
    return result;
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
