const db = require('../../../proxy/db');

/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     summary: Récupère tous les utilisateurs (admin seulement)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
module.exports = async (req, res) => {
    try {
        const users = await db.getAllUsers();
        
        // Retourner les utilisateurs sans les mots de passe
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
        
        res.set('Cache-Control', 'private, no-cache');
        res.json(safeUsers);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};