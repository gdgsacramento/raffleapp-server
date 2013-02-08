/**
 * This module will override the node-config settings for certain environment variables.  This allows for keeping
 * secure information (db password, etc) out of github.  Each environment value must be explicitly declared here.
 * There is currently no convention to allow this to override to happen, although it seems possible.
 */

exports.init = function() {
    console.log("NODE_ENV=" + process.env.NODE_ENV);
    var CONFIG = require('config');

    if(process.env.MONGO_URL_CONNECTION) {
        console.log("Overriding MONGO.URL_CONNECTION with process.env.MONGO_URL_CONNECTION");
        CONFIG.MONGO.URL_CONNECTION = process.env.MONGO_URL_CONNECTION;
    }

    if(process.env.AUTH_CLIENT_ID) {
        console.log("Overriding AUTH.CLIENT_ID with process.env.AUTH_CLIENT_ID");
        CONFIG.AUTH.CLIENT_ID = process.env.AUTH_CLIENT_ID;
    }

    if(process.env.AUTH_CLIENT_SECRET) {
        console.log("Overriding AUTH.CLIENT_SECRET with process.env.AUTH_CLIENT_SECRET");
        CONFIG.AUTH.CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
    }
}