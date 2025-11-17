const db_books = require('../../../proxy/db_books');

/**
 * @openapi
 * /api/v1/books:
 *   get:
 *     summary: Récupère la liste paginée de tous les livres
 *     description: >
 *       Retourne une liste de livres paginée avec liens HATEOAS et métadonnées de pagination.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numéro de la page à récupérer (par défaut 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Nombre de livres par page (par défaut 10)
 *         example: 10
 *     responses:
 *       200:
 *         description: Liste paginée des livres récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Le Petit Prince
 *                       author:
 *                         type: string
 *                         example: Antoine de Saint-Exupéry
 *                       _links:
 *                         type: object
 *                         properties:
 *                           self:
 *                             type: object
 *                             properties:
 *                               href:
 *                                 type: string
 *                                 example: http://localhost:3000/api/v1/books/1
 *                           collection:
 *                             type: object
 *                             properties:
 *                               href:
 *                                 type: string
 *                                 example: http://localhost:3000/api/v1/books
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       example: 57
 *                     totalPages:
 *                       type: integer
 *                       example: 6
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: http://localhost:3000/api/v1/books?page=1&limit=10
 *                     next:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: http://localhost:3000/api/v1/books?page=2&limit=10
 *                     prev:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: null
 *       500:
 *         description: Erreur interne du serveur
 */

module.exports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Récupération de tous les livres depuis la DB
        const allBooks = await db_books.getAll();
        const totalItems = allBooks.length;
        const totalPages = Math.ceil(totalItems / limit);

        // Sélection de la "page"
        const paginatedBooks = allBooks.slice(offset, offset + limit);

        // Construire correctement l'URL de base de la collection
        const basePath = (req.baseUrl && req.baseUrl !== '/') ? req.baseUrl : req.path;
        const cleanBasePath = basePath.replace(/\/$/, ''); // supprime slash final si présent
        const baseUrl = `${req.protocol}://${req.get('host')}${cleanBasePath}`;

        const booksWithLinks = paginatedBooks.map(book => ({
            ...book,
            _links: {
                self: { href: `${baseUrl}/${book.id}` },
                collection: { href: baseUrl }
            }
        }));

        const nextPage = page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
        const prevPage = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;

        res.json({
            items: booksWithLinks,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages
            },
            _links: {
                self: { href: `${baseUrl}?page=${page}&limit=${limit}` },
                next: nextPage ? { href: nextPage } : null,
                prev: prevPage ? { href: prevPage } : null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
