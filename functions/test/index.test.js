const test = require('firebase-functions-test')();
const sinon = require('sinon');
const assert = require('assert');
const admin = require('firebase-admin');


describe('Raffle functions', function () {
    afterEach(function () {
        sinon.restore();
    });

    it('should draw winners', async function () {
        const raffleFunctions = require('../index.js');

        const wrapped = test.wrap(raffleFunctions.drawWinners);

        const before = test.database.makeDataSnapshot(false, '/raffles/myRaffle/drawn');
        const after = test.database.makeDataSnapshot(true, '/raffles/myRaffle/drawn');

        sinon.stub(admin.database.Reference.prototype, 'once').resolves({
            val: () => ({
                obj1: {name: 'john'},
                obj2: {name: 'doe'}
            })
        });
        const winnersStub = sinon.stub(admin.database.Reference.prototype, 'set').callsFake(winners => {
            assert.deepStrictEqual(winners.sort(), ['doe', 'john']); // order is not important
            return Promise.resolve();
        });
        await wrapped(test.makeChange(before, after));
        assert(winnersStub.called, true);
    });
});
