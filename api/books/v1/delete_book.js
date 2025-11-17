const db_books = require('../../../proxy/db_books');

/**
 * @openapi
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Supprime un livre par son identifiant
 *     description: >
 *       Supprime le livre correspondant à l'ID fourni.  
 *       Retourne un message de confirmation et les détails du livre supprimé.
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant unique du livre à supprimer
 *         example: 3
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Livre supprimé
 *                 deleted:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     title:
 *                       type: string
 *                       example: Le Petit Prince
 *                     author:
 *                       type: string
 *                       example: Antoine de Saint-Exupéry
 *                     year:
 *                       type: integer
 *                       example: 1943
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

    try {
        const deletedBook = await db_books.deleteById(id);
        res.json({ message: "Livre supprimé", deleted: deletedBook });
    } catch (error) {
        if (error.message === "Book not found") {
            return res.status(404).json({ message: "Livre non trouvé" });
        }
        res.status(500).json({ message: "Erreur serveur" });
    }
};