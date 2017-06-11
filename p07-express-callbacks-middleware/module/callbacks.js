module.exports = {
    processing: function (req, res, next) {
        console.log('\n\nprocessing request for "' + req.url + '"....');
        next(); //if you do call next(), don't send a response to the client
    },
    sendResponce: function (req, res, next) {
        console.log('send responce for "' + req.url + '"');
        res.send('send responce for "' + req.url + '"');
    },
    notFound: function (req, res, next) {
        console.log('404 - Not found error for "' + req.url + '"');
        res.status(404);
        res.send('404 - not found');
    },
    serverError: function (req, res, next) {
        console.log('500 - Server Error for "' + req.url + '"');
        res.status(500);
        res.send('500 - Server Error');
    },
    errorThrown: function (err, req) {
        console.log('error thrown for "' + req.url + '"');
        throw new Error('error thrown for "' + req.url + '"'); //500 
    },
    errorThrownAndPassedOn: function (err, req, res, next) {
        console.log('error thrown for "' + req.url + ' and passed on"');
        next(new Error('error thrown for "' + req.url + '"'));
    },
    errorIgnored: function (err, req, res, next) {
        console.log('error deteccted but ignorred (not passed on): ' + err.message);
        next();
    },
    errorDetectedAndSendResponce: function (err, req, res, next) {
        console.log('\n500 - unhandled error detected: ' + err.message);
        res.status(500);
        res.send('\n500 - Server Error detected: ' + err.message);
        //if you do send a response to the client, don't use next()
    },
    errIO: function (req, res, next) {
        //Error: ENOENT: no such file or directory, open '/notExistingFile' at Error (native)
        require("fs").readFile("/notExistingFile", function (err, data) {
            if (err) {
                next(err);
            }
            else {
                try {
                    nullObject.someMethod(); //throws a null reference exception
                    res.send("errorIO");
                }
                catch (e) {
                    res.send(500);
                }
            }
        });
    }
}