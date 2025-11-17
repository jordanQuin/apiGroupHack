const getCars = require('./get_cars');
const getCar = require('./get_car');
const postCar = require('./post_car');
const putCar = require('./put_car');
const deleteCar = require('./delete_car');
const getUserProfile = require('./get_user_profile');
const requireAuth = require('../../../middlewares/require_auth');
const checkOwnership = require('../../../middlewares/check_ownership');

module.exports = function(app, limiters) {
    // Route 3: Récupérer toutes les voitures (publique, sécurisée)
    app.get("/api/v1/cars", limiters.ONE_SEC, getCars);
    
    // Route 4: Récupérer une voiture par ID (FAILLE IDOR - pas de vérification de propriétaire)
    app.get("/api/v1/cars/:id", requireAuth, limiters.ONE_SEC, getCar);
    
    // Route 5: Créer une voiture (sécurisée)
    app.post("/api/v1/cars", requireAuth, limiters.FIVE_SEC, postCar);
    
    // Route 6: Modifier une voiture (FAILLE - utilise le middleware défaillant)
    app.put("/api/v1/cars/:id", requireAuth, checkOwnership, limiters.FIVE_SEC, putCar);
    
    // Route 7: Supprimer une voiture (sécurisée avec vérification de propriétaire dans le handler)
    app.delete("/api/v1/cars/:id", requireAuth, limiters.FIVE_SEC, deleteCar);
    
    // Route 8: Profil utilisateur (sécurisée)
    app.get("/api/v1/users/profile", requireAuth, limiters.ONE_SEC, getUserProfile);
};