//$ node app.js

var app = require('express')();
app.disable('x-powered-by'); //disable express.js info in response headers (for safety reason)

const callbacks = require('./module/callbacks.js');

//all incomming requests
app.use(callbacks.processing);

//favicon.ico - 404 Not found
app.get('/favicon.ico', callbacks.notFound);

app.get('/', callbacks.sendResponce); //home

app.get('/404', callbacks.notFound);
app.get('/500', callbacks.serverError);

app.get('/error', callbacks.errorThrown); //500 (Internal Server Error)

app.get('/error-ignored', callbacks.errorThrownAndPassedOn);
//app.get('/error-ignored', callbacks.errorIgnored);
app.get('/error-ignored', callbacks.errorDetectedAndSendResponce);

app.get('/err-io', callbacks.errIO);
app.get('/err-io', callbacks.errorDetectedAndSendResponce);

//responce on all requests (ignoring notFound)
//app.use(callbacks.sendResponce);

//not available for all requests (to activate: comment callbacks.sendResponce)
app.use(callbacks.notFound);


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});