const v1Routes = require('./v1/routes');
const adminRoutes = require('./admin/routes');

module.exports = function(app, limiters) {
    v1Routes(app, limiters);
    adminRoutes(app, limiters);
};