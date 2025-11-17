const db = require('../../../proxy/db');

/**
 * @openapi
 * /api/v1/admin/cars:
 *   get:
 *     summary: Récupère toutes les voitures avec détails propriétaire (admin seulement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des voitures
 */
module.exports = async (req, res) => {
    try {
        const cars = await db.getAllCars();
        const users = await db.getAllUsers();
        
        // Enrichir les données avec les informations du propriétaire
        const enrichedCars = cars.map(car => {
            const owner = users.find(user => user.id === car.ownerId);
            return {
                ...car,
                owner: owner ? { 
                    id: owner.id, 
                    email: owner.email,
                    role: owner.role 
                } : null
            };
        });
        
        res.set('Cache-Control', 'private, no-cache');
        res.json(enrichedCars);
    } catch (error) {
        console.error('Admin get all cars error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};