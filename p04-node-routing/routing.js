//run: $ node routing.js
var http = require('http');

http.createServer(function (req, res) {
    // normalize url by removing querystring, optional
    // trailing slash, and making it lowercase
    var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch (path) {
        case '':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>Homepage</h1>');
            break;
        case '/about':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>About</h1>');
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Not Found</h1>');
            break;
    }
}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');