const db = require('../proxy/db');

// FAILLE INTENTIONNELLE: IDOR - pas de vérification de propriétaire
// Ce middleware devrait vérifier que l'utilisateur est propriétaire de la ressource
module.exports = async (req, res, next) => {
    // COMMENTÉ INTENTIONNELLEMENT POUR CRÉER UNE FAILLE IDOR
    /*
    const carId = parseInt(req.params.id);
    const car = await db.getCarById(carId);
    
    if (!car) {
        return res.status(404).json({ message: "Voiture non trouvée" });
    }
    
    if (car.ownerId !== req.userId && req.userRole !== 'admin') {
        return res.status(403).json({ 
            message: "Accès interdit. Vous n'êtes pas propriétaire de cette voiture." 
        });
    }
    */
    
    // Bypass - permet à n'importe qui d'accéder aux ressources
    next();
};