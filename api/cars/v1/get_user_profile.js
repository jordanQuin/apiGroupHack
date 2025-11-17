const db = require('../../../proxy/db');

/**
 * @openapi
 * /api/v1/users/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 */
module.exports = async (req, res) => {
    try {
        const user = await db.getUserById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const { password, ...userProfile } = user;
        
        res.set('Cache-Control', 'private, no-cache');
        res.json(userProfile);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};