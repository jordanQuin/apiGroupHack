const db = require('../../../proxy/db');

/**
 * @openapi
 * /api/v1/cars/{id}:
 *   get:
 *     summary: Récupère une voiture par son identifiant
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant de la voiture
 *     responses:
 *       200:
 *         description: Voiture trouvée
 *       404:
 *         description: Voiture non trouvée
 */
// FAILLE INTENTIONNELLE: IDOR - pas de vérification de propriétaire
// N'importe qui peut accéder aux détails de n'importe quelle voiture
module.exports = async (req, res) => {
    try {
        // Validation basique mais pas de vérification de propriétaire
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const car = await db.getCarById(id);

        if (!car) {
            return res.status(404).json({ message: "Voiture non trouvée" });
        }

        // PROBLÈME: retourne la voiture même si elle n'appartient pas à l'utilisateur connecté
        // Devrait vérifier: car.ownerId === req.userId || req.userRole === 'admin'
        
        res.json(car);
    } catch (error) {
        console.error('Get car error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};