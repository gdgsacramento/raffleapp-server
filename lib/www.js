/*
 * Author: Thomas Amsler : tamsler@gmail.com
 */

/*
 * Serving static web content HTML, JS, CSS, PNG, JPEG, JPG
 */

var fs = require('fs');
var url = require('url');
var path = require('path');

var ROOT_PATH = './app';

    function serveV1(request, response, next) {

    var uri = url.parse(request.url).pathname;
    var filePath = ROOT_PATH + uri;

    if (filePath === (ROOT_PATH + '/')) {

        filePath = ROOT_PATH + '/index.html';
    }

    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
    }

    fs.exists(filePath, function(exists) {

        if (exists) {

            fs.readFile(filePath, function(error, content) {

                if (error) {

                    response.writeHead(500);
                    response.end();
                }
                else {

                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {

            fs.readFile(ROOT_PATH + '/index.html', function(error, content) {

                if (error) {

                    response.writeHead(500);
                    response.end();
                }
                else {

                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
    });
}

exports.serveV1 = serveV1;