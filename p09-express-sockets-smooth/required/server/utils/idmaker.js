//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
//https://developer.mozilla.org/en/docs/web/javascript/reference/statements/export
//https://www.sitepoint.com/understanding-module-exports-exports-node-js/

var exports = module.exports = {};

exports.makeid = function(length) {
    if(!length) length = 6;

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
