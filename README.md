
[![Build Status](https://travis-ci.org/gdgsacramento/raffleapp-server.png)](https://travis-ci.org/gdgsacramento/raffleapp-server)

#raffleapp-server
This is a firebase application for the gdg raffle app.

##Project Setup
  * Install node js/npm
  * Run `npm install`.  This will install dependencies needed for this applicaiton.
  * Run `npm start`.  This should start the server.  It will automatically open a browser pointing to http://localhost:9000 and display the app

##Tests
  * Install and have MongoDB running.  The tests are assuming a local mongo instance.
  * Create a raffleappTest in your mongo instance. Type `use raffleappTest` in mongo shell.
  * Run `npm install` if you have not already.
  * Run `npm run-script start-test` to run the node test server.
  * Run `npm test`.  This should execute all tests.

##Project Setup for new Firebase driven version (No NodeJS and no Mongo DB).
  *you just have to change 2 files.
  * index.html
  *     replace all
  *      <link href="/lib/
  *     with
  *       <link href="./lib/
  *     (basically add a dot to each of those)
  *
  *     then completely comment out <script src="./socket.io/socket.io.js"></script>
  * app.js
  *    change
  *    'partials/raffle.html
  *    to
  *    'raffleapp-server/app/partials/raffle.html

