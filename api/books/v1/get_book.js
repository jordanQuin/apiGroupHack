const books = require('../../../proxy/db_books');

/**
 * @openapi
 * /api/v1/books/{id}:
 *   get:
 *     summary: Récupère un livre par son identifiant
 *     description: >
 *       Retourne un objet représentant un livre spécifique selon l'ID fourni dans l'URL.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique du livre
 *         example: 1
 *     responses:
 *       200:
 *         description: Livre trouvé et renvoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Le Petit Prince
 *                 author:
 *                   type: string
 *                   example: Antoine de Saint-Exupéry
 *                 year:
 *                   type: integer
 *                   example: 1943
 *       404:
 *         description: Livre non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Livre non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

module.exports = async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await books.getById(id);

    if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.json(book);
};