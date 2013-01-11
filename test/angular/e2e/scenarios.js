'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('raffle app', function() {

    /*
     * NOTE: When we use the mock service, we cannot init the index.html page
     * because we would loose all existing content.
     */
    it('should navigate to index.html', function() {

        browser().navigateTo('/index.html');
    });

    it('should create a raffle then show it in the list', function() {
        expect(repeater('.raffles div').count()).toEqual(0);//before we add one
        input('raffle.raffle_name').enter('test raffle');
        element("#create_button", "Create Button").click();
        expect(repeater('.raffles div').count()).toEqual(1);
    });

    it('should select a raffle and highlight it', function() {
        expect(repeater('.raffles div').count()).toBeGreaterThan(0);
        expect(element('.raffles div.select-raffle').count()).toEqual(0);
        element('.raffles div:eq(0)').click();
        expect(element('.raffles div.select-raffle').count()).toEqual(1);
    });

    it('should delete a raffle then display an empty list', function() {
        expect(repeater('.raffles div').count()).toEqual(1); //before we delete
        element('.raffles div button', "Delete icon").click();
        expect(repeater('.raffles div').count()).toEqual(0);
    });



});
