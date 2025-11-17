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
module.exports = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const car = await db.getCarById(id);

        if (!car) {
            return res.status(404).json({ message: "Voiture non trouvée" });
        }
        
        if (car.ownerId !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ 
                message: "Accès interdit. Vous n'êtes pas propriétaire de cette voiture." 
            });
        }

        res.json(car);
    } catch (error) {
        console.error('Get car error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};