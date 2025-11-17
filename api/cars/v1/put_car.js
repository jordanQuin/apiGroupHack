const db = require('../../../proxy/db');
const Joi = require('joi');

// Validation des données de mise à jour (optionnelles)
const updateCarSchema = Joi.object({
    brand: Joi.string().trim().min(1).max(50).optional(),
    model: Joi.string().trim().min(1).max(50).optional(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),
    price: Joi.number().min(0).max(1000000).optional()
}).min(1); // Au moins un champ requis

/**
 * @openapi
 * /api/v1/cars/{id}:
 *   put:
 *     summary: Met à jour une voiture existante
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Voiture mise à jour
 */
module.exports = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        // Validation des données
        const { error, value } = updateCarSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Vérifier que la voiture existe
        const existingCar = await db.getCarById(id);
        if (!existingCar) {
            return res.status(404).json({ message: "Voiture non trouvée" });
        }

        // CETTE ROUTE UTILISE LE MIDDLEWARE check_ownership DÉFAILLANT
        // qui ne vérifie pas réellement la propriété
        
        // Mettre à jour la voiture en conservant l'ownerId original
        const updatedData = {
            ...existingCar,
            ...value
        };

        const updatedCar = await db.updateCarById(id, updatedData);
        
        res.set('Cache-Control', 'no-store');
        res.json(updatedCar);
    } catch (error) {
        console.error('Update car error:', error);
        if (error.message === "Car not found") {
            return res.status(404).json({ message: "Voiture non trouvée" });
        }
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};