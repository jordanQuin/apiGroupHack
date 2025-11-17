const getAllUsers = require('./get_all_users');
const getAllCars = require('./get_all_cars');
const requireAuth = require('../../../middlewares/require_auth');
const requireAdmin = require('../../../middlewares/require_admin');

module.exports = function(app, limiters) {
    // Route 9: Voir tous les utilisateurs (admin seulement, sécurisée)
    app.get("/api/v1/admin/users", requireAuth, requireAdmin, limiters.ONE_SEC, getAllUsers);
    
    // Route 10: Voir toutes les voitures avec propriétaires (admin seulement, sécurisée)
    app.get("/api/v1/admin/cars", requireAuth, requireAdmin, limiters.ONE_SEC, getAllCars);
};