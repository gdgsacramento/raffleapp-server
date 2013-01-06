
/*
 * http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
function fisherYates ( myArray ) {

    var i = myArray.length;

    if ( i == 0 ) return false;

    while ( --i ) {

        var j = Math.floor( Math.random() * ( i + 1 ) );

        var tempi = myArray[i];

        var tempj = myArray[j];

        myArray[i] = tempj;

        myArray[j] = tempi;
    }
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

/*
 * Export functions
 */
exports.fisherYates = fisherYates;
exports.shuffleArray = shuffleArray;