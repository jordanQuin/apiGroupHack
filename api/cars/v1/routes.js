const getCars = require('./get_cars');
const getCar = require('./get_car');
const postCar = require('./post_car');
const putCar = require('./put_car');
const deleteCar = require('./delete_car');
const getUserProfile = require('./get_user_profile');
const requireAuth = require('../../../middlewares/require_auth');

module.exports = function(app, limiters) {
    // Récupérer toutes les voitures
    app.get("/api/v1/cars", limiters.ONE_SEC, getCars);
    
    // Récupérer une voiture par ID
    app.get("/api/v1/cars/:id", requireAuth, limiters.ONE_SEC, getCar);
    
    // Créer une voiture
    app.post("/api/v1/cars", requireAuth, limiters.FIVE_SEC, postCar);
    
    // Modifier une voiture
    app.put("/api/v1/cars/:id", requireAuth, limiters.FIVE_SEC, putCar);
    
    // Supprimer une voiture
    app.delete("/api/v1/cars/:id", requireAuth, limiters.FIVE_SEC, deleteCar);
    
    // Profil utilisateur
    app.get("/api/v1/users/profile", requireAuth, limiters.ONE_SEC, getUserProfile);
};