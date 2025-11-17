const db = require('../../../proxy/db');
const Joi = require('joi');

// Validation sécurisée des données de voiture
const carSchema = Joi.object({
    brand: Joi.string().trim().min(1).max(50).required(),
    model: Joi.string().trim().min(1).max(50).required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    price: Joi.number().min(0).max(1000000).required()
});

/**
 * @openapi
 * /api/v1/cars:
 *   post:
 *     summary: Crée une nouvelle voiture
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - year
 *               - price
 *             properties:
 *               brand:
 *                 type: string
 *                 example: Toyota
 *               model:
 *                 type: string
 *                 example: Camry
 *               year:
 *                 type: integer
 *                 example: 2023
 *               price:
 *                 type: number
 *                 example: 25000
 *     responses:
 *       201:
 *         description: Voiture créée avec succès
 */
module.exports = async (req, res) => {
    try {
        // Validation sécurisée des données d'entrée
        const { error, value } = carSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { brand, model, year, price } = value;

        // Créer la voiture avec l'ID du propriétaire
        const newCar = await db.createCar({
            brand,
            model,
            year,
            price,
            ownerId: req.userId // Associer la voiture à l'utilisateur connecté
        });

        // Définir les en-têtes de cache pour éviter la mise en cache
        res.set('Cache-Control', 'no-store');

        res.status(201).json(newCar);
    } catch (error) {
        console.error('Create car error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};