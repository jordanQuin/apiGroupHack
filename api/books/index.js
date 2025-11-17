const bookv1 = require('./v1/routes');
const bookv2 = require('./v2/routes');

module.exports = function(app, limiters) {
    bookv1(app, limiters);
    bookv2(app, limiters);
}