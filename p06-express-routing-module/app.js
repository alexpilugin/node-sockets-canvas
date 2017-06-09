const express = require('express');
const routes = require('./module/routes');

const app = express();
app.set('port', process.env.PORT || 3000);

// homepage
app.get('/', routes.homePage);

// about page
app.get('/about', routes.aboutPage);

// info page
app.get('/info', routes.infoPage);

// custom 404 page (middleware)
app.use(routes.notFound);

// custom 500 page (middleware)
app.use(routes.serverError);

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});