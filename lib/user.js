
var mongo = require('./mongo');
var request = require('request');
var crypto = require('crypto');
var USER_COLLECTION = "user";
var ACCESS_TOKEN_COLLECTION = "access_token";

/**
 * Updates or inserts a user with the data passed in.
 *
 * @param user The user object.
 * @param callback(err, user) Passes the newly created user including mongo id.
 */
var upsertUser = function(user, callback) {
    mongo.collection(USER_COLLECTION, function(collection) {
        collection.findAndModify({id:user.id},'_id', user, {new:true, upsert:true}, function(err, doc) {
            if(err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    });
};
/**
 * Find the first user matching the given query.
 *
 * @param query The query to use in find example {id:23}
 * @param callback(err, user) passes back the user found or null, err for error
 */

var findUser = function(query, callback) {
    mongo.collection(USER_COLLECTION, function(collection) {
        var cursor = collection.find(query, {});
        cursor.nextObject(function(err, doc) {
            if(err) {
                callback(err);
            } else {
                if(doc) {
                    callback(null, doc);
                } else {
                    callback(null, null);
                }
            }
        });
    });
};


/**
 * Updates or inserts a access token into the database.
 *
 * @param user_id The user_id (mongo user._id)
 * @param callback(err, access_token) passes the newly created/updated token
 */
var upsertAccessToken = function(user_id, callback) {
    var token = crypto.randomBytes(32).toString('hex');
    mongo.collection(ACCESS_TOKEN_COLLECTION, function(collection) {
        collection.findAndModify({user_id:user_id},'_id', {user_id:user_id, token:token}, {new:true, upsert:true}, function(err, doc) {
            if(err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    });
};

/**
 *  Finds an access token that equals both user_id and access_token and returns it, or null.
 *
 *  This method assumes only one record exists for the query.
 *
 * @param user_id The user id to look for.
 * @param token The access_token to look for.
 * @param callback(err, access_token) passes the found access token or null.
 */
var findAccessToken = function(user_id, token, callback) {
    mongo.collection(ACCESS_TOKEN_COLLECTION, function(collection) {
        var cursor = collection.find({user_id:user_id, token:token}, {});
        cursor.nextObject(function(err, doc) {
            if(err) {
                callback(err);
            } else {
                if(doc) {
                    callback(null, doc);
                } else {
                    callback(null, null);
                }
            }
        });
    });
};

/**
 * Removes the access token for the given user id.
 *
 * @param user_id The user id.
 * @param callback(err) Only passes error if there is one.
 */
var removeAccessToken = function(user_id, callback) {
    mongo.collection(ACCESS_TOKEN_COLLECTION, function(collection) {

        collection.remove({user_id : user_id}, function(err, doc) {

            if(err) {
                callback(err);
            }
            else {
                callback(null, doc);
            }
        });
    });
};

/**
 * Calls the google oauth2 to exchange authorization code for access token. Using the oauth web server flow.
 * https://developers.google.com/accounts/docs/OAuth2WebServer#handlingtheresponse
 *
 * @param auth_code The google authorization code.
 * @param callback(err, acces_token) passes access token.
 */
var googleAuth = function(auth_code, callback) {
    var options = {
        url: 'https://accounts.google.com/o/oauth2/token',
        timeout: 5000,
        form:{
            code: auth_code,
            client_id:'574148431532.apps.googleusercontent.com',
            client_secret:'WB2Foq0Ayy_7vMGug9w7L4lr',
            redirect_uri:'http://localhost:8080/login.html',
            grant_type:'authorization_code'
        },
        json:true
    };

    request.post(options, function(err, res, body) {
        if(res.statusCode !== 200) {
            callback(body);
        } else {
            callback(null, body.access_token);
        }
    });
};

/**
 * Calls the google oauth2 to get profile information using the access_token given.
 *
 * @param access_token The google access code.
 * @param callback(err, userObject) passes user object.
 */
var googleProfile = function(access_token, callback) {
    var options = {
        url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token='+access_token,
        timeout: 5000,
        json:true
    };
    request.get(options, function(err, res, body) {
        if(res.statusCode !== 200) {
            callback(body);
        } else {
            callback(null, body);
        }
    });
};

var handleError = function(err, res, next) {
    console.log(err);
    res.send(500);
    return next();
};

exports.googleOAuth2 = function(req, res, next) {

    if(!req.body || !req.body.auth_code) {

        console.log("ERROR: Missing authorization code");
        res.send(400);
        return next();
    }

    googleAuth(req.body.auth_code, function(err, access_token) {
        if(err) {
            return handleError(err, res, next);
        }
        googleProfile(access_token, function(err, userObject) {
            if(err) {
                return handleError(err, res, next);
            }
            upsertUser(userObject, function(err, user) {
                if(err) {
                    return handleError(err, res, next);
                }
                upsertAccessToken(user._id, function(err, token) {
                    if(err) {
                        return handleError(err, res, next);
                    }
                    res.json(200, {id:token.user_id, token:token.token});
                    return next();
                });
            });
        });
    });
};

exports.upsertUser = upsertUser;
exports.findUser = findUser;
exports.googleAuth = googleAuth;
exports.googleProfile = googleProfile;
exports.upsertAccessToken = upsertAccessToken;
exports.findAccessToken = findAccessToken;
exports.removeAccessToken = removeAccessToken;

