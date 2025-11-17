const db = require('../../../proxy/db');

/**
 * @openapi
 * /api/v1/cars/{id}:
 *   delete:
 *     summary: Supprime une voiture
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Voiture supprimée
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

        const deletedCar = await db.deleteCarById(id);
        
        res.set('Cache-Control', 'no-store');
        res.json({ message: "Voiture supprimée avec succès", deleted: deletedCar });
    } catch (error) {
        console.error('Delete car error:', error);
        if (error.message === "Car not found") {
            return res.status(404).json({ message: "Voiture non trouvée" });
        }
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};