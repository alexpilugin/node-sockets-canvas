//$ node app.js

var app = require('express')();
app.disable('x-powered-by'); //disable express.js info in response headers (for safety reason)

const middleware = require('./module/middleware.js');

//all incomming requests
app.use(middleware.processing);

//favicon.ico - 404 Not found
app.get('/favicon.ico', middleware.notFound);

app.get('/', middleware.sendResponce); //home

app.get('/404', middleware.notFound);
app.get('/500', middleware.serverError);

app.get('/error', middleware.errorThrown); //500 (Internal Server Error)

app.get('/error-ignored', middleware.errorThrownAndPassedOn);
//app.get('/error-ignored', middleware.errorIgnored);
app.get('/error-ignored', middleware.errorDetectedAndSendResponce);

app.get('/err-io', middleware.errIO);
app.get('/err-io', middleware.errorDetectedAndSendResponce);

//responce on all requests (ignoring notFound)
//app.use(middleware.sendResponce);

//not available for all requests (to activate: comment middleware.sendResponce)
app.use(middleware.notFound);


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});