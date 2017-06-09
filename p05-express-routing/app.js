var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

// homepage
app.get('/', function (req, res) {
    res.type('text/html');
    res.send('<h1>Home page</h1><br /><a href="/about"> about </a><a href="/info"> info </a>');
});

// about page
app.get('/about', function (req, res) {
    res.type('text/html');
    res.send('<h1>About page</h1><br /><a href="/"> home </a><a href="/info"> info </a>');
});

// info page
app.get('/info', function (req, res) {
    res.type('text/html');
    res.send('<h1>Info page</h1><br /><a href="/"> home </a><a href="/about"> about </a>');
});

// custom 404 page (middleware)
app.use(function (req, res, next) {
    res.type('text/html');
    res.status(404);
    res.send('<h1>404 - Not Found</h1>');
});

// custom 500 page (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});