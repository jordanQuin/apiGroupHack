const db_books = require('../../../proxy/db_books');

/**
 * @openapi
 * /api/v1/books:
 *   post:
 *     summary: Crée un nouveau livre
 *     description: >
 *       Ajoute un nouveau livre à la base de données.  
 *       Le titre et l’auteur sont obligatoires.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 example: Le Petit Prince
 *               author:
 *                 type: string
 *                 example: Antoine de Saint-Exupéry
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 title:
 *                   type: string
 *                   example: Le Petit Prince
 *                 author:
 *                   type: string
 *                   example: Antoine de Saint-Exupéry
 *       400:
 *         description: Données manquantes ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Titre et auteur sont requis.
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur serveur
 */

module.exports = async (req, res) => {
    const { title, author } = req.body;

    if (!title || !author) {
        return res.status(400).json({ message: "Titre et auteur sont requis." });
    }

    const newBook = await db_books.create({ title, author });
    res.status(201).json(newBook);
};