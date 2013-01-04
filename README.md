[![Build Status](https://travis-ci.org/gdgsacramento/raffleapp-server.png)](https://travis-ci.org/gdgsacramento/raffleapp-server)

#raffleapp-server
This is a angular.js/node.js/mongoDB server application for a raffle application.  This is a proof of concept application for the 
angular/node/mongo stack.  It is used to determine best practices for developing and testing with these technologies.

##Project Setup
  * Install and have MongoDB running.  Alternatively you can use a hosted (MongoLab,etc.) instance.  You must specify a `config/development.json` file to point to a hosted mongo instance.  The `config/default.json` assumes a local instance.
  * Create a raffleapp db in your mongo instance.  Type `use raffleapp` in mongo shell.
  * Run `npm install`.  This will install dependencies needed for this applicaiton.
  * Run `npm start`.  This should start the server.  You will then be able to navigate to localhost:8080 in your browser to see the application.

##Tests
  * Install and have MongoDB running.  The tests are assuming a local mongo instance.
  * Create a raffleappTest in your mongo instance. Type `use raffleappTest` in mongo shell.
  * Run `npm install` if you have not already.
  * Run `npm run-script start-test` to run the node test server.
  * Run `npm test`.  This should execute all tests.
