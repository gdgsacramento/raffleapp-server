'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('raffle app', function() {

  beforeEach(function() {
    browser().navigateTo('/index.html');
  });


  it('should be no raffles listed', function() {
     expect(repeater('.raffles div').count()).toEqual(0);
  });

});
