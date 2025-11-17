const db = require('../../../proxy/db');
const Joi = require('joi');

// Schema de validation pour la pagination
const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    brand: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional()
});

/**
 * @openapi
 * /api/v1/cars:
 *   get:
 *     summary: Récupère la liste paginée de toutes les voitures
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Nombre de voitures par page
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filtrer par marque
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Prix maximum
 *     responses:
 *       200:
 *         description: Liste paginée des voitures
 */
module.exports = async (req, res) => {
    try {
        const { error, value } = querySchema.validate(req.query);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { page, limit, brand, minPrice, maxPrice } = value;
        const offset = (page - 1) * limit;

        let allCars = await db.getAllCars();

        if (brand) {
            allCars = allCars.filter(car => 
                car.brand.toLowerCase().includes(brand.toLowerCase())
            );
        }
        if (minPrice !== undefined) {
            allCars = allCars.filter(car => car.price >= minPrice);
        }
        if (maxPrice !== undefined) {
            allCars = allCars.filter(car => car.price <= maxPrice);
        }

        const totalItems = allCars.length;
        const totalPages = Math.ceil(totalItems / limit);

        const paginatedCars = allCars.slice(offset, offset + limit);

        const baseUrl = `${req.protocol}://${req.get('host')}/api/v1/cars`;

        const carsWithLinks = paginatedCars.map(car => ({
            ...car,
            _links: {
                self: { href: `${baseUrl}/${car.id}` },
                collection: { href: baseUrl }
            }
        }));

        const buildQueryString = (pageNum) => {
            const params = new URLSearchParams();
            params.set('page', pageNum.toString());
            params.set('limit', limit.toString());
            if (brand) params.set('brand', brand);
            if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
            if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
            return params.toString();
        };

        const nextPage = page < totalPages ? `${baseUrl}?${buildQueryString(page + 1)}` : null;
        const prevPage = page > 1 ? `${baseUrl}?${buildQueryString(page - 1)}` : null;

        res.set('Cache-Control', 'public, max-age=300');

        res.json({
            items: carsWithLinks,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            },
            _links: {
                self: { href: `${baseUrl}?${buildQueryString(page)}` },
                next: nextPage ? { href: nextPage } : null,
                prev: prevPage ? { href: prevPage } : null
            }
        });
    } catch (error) {
        console.error('Get cars error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};