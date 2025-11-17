const db_books = require('../../../proxy/db_books');

/**
 * @openapi
 * /api/v1/books/{id}:
 *   put:
 *     summary: Met à jour un livre existant
 *     description: >
 *       Modifie les informations d'un livre existant selon l'ID fourni.  
 *       Le titre et l'auteur peuvent être mis à jour.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique du livre à mettre à jour
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Le Petit Prince Modifié
 *               author:
 *                 type: string
 *                 example: Antoine de Saint-Exupéry
 *     responses:
 *       200:
 *         description: Livre mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 title:
 *                   type: string
 *                   example: Le Petit Prince Modifié
 *                 author:
 *                   type: string
 *                   example: Antoine de Saint-Exupéry
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
    const id = parseInt(req.params.id);
    const { title, author } = req.body;

    try {
        const updatedBook = await db_books.updateById(id, { title, author });
        res.json(updatedBook);
    } catch (error) {
        if (error.message === "Book not found") {
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
};