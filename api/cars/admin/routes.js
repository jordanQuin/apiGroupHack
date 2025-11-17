const getAllUsers = require('./get_all_users');
const getAllCars = require('./get_all_cars');
const requireAuth = require('../../../middlewares/require_auth');
const requireAdmin = require('../../../middlewares/require_admin');

module.exports = function(app, limiters) {
    // Voir tous les utilisateurs
    app.get("/api/v1/admin/users", requireAuth, requireAdmin, limiters.ONE_SEC, getAllUsers);
    
    // Voir toutes les voitures avec propriétaires
    app.get("/api/v1/admin/cars", requireAuth, requireAdmin, limiters.ONE_SEC, getAllCars);
};