const test = require('firebase-functions-test')();
const sinon = require('sinon');
const assert = require('assert');
const admin = require('firebase-admin');
const nock = require('nock');


describe('Raffle functions', function () {
    before(function () {
        nock.disableNetConnect();
    });

    afterEach(function () {
        sinon.restore();
    });

    after(function () {
        nock.enableNetConnect();
    });

    it('should draw winners', async function () {
        nock('https://www.googleapis.com')
            .post('/oauth2/v4/token')
            .reply(200, {
                access_token: 'access_token',
                id_token: 'id_token',
                expires_in: 1,
                token_type: 'Bearer'
            });

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
        const winnersStub = sinon.stub(admin.database.Reference.prototype, 'set').callsFake(async winners => {
            assert.deepStrictEqual(winners.sort(), ['doe', 'john']); // order is not important
        });
        await wrapped(test.makeChange(before, after));
        assert(winnersStub.called, true);
    });
});
