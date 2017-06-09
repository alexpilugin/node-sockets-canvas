const menu = '<a href="/"> home </a><a href="/about"> about </a><a href="/info"> info </a>';

exports.homePage = function (req, res) {
    res.type('text/html');
    res.send('<h1>Home page</h1><br />'+ menu);
}

exports.aboutPage = function (req, res) {
    res.type('text/html');
    res.send('<h1>About page</h1><br />'+ menu);
}

exports.infoPage = function (req, res) {
    res.type('text/html');
    res.send('<h1>Info page</h1><br />'+ menu);
}

exports.notFound = function (req, res, next) {
    res.type('text/html');
    res.status(404);
    res.send('<h1>404 - Not Found</h1>'+ menu);
}

exports.serverError = function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
}