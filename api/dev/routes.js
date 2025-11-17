const jwt = require('jsonwebtoken');

module.exports = function(app) {
    // Route de développement pour générer des tokens JWT
    app.get('/api/dev/token', (req, res) => {
        const { userId = 1, role = 'user' } = req.query;
        
        try {
            const token = jwt.sign(
                { userId: parseInt(userId), role }, 
                process.env.JWT_SECRET,
                { expiresIn: '1h', algorithm: 'HS256' }
            );

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 1000 // 1 hour
            };

            res.cookie('jwtToken', token, cookieOptions);
            return res.json({ 
                message: "Token JWT généré",
                token: token,
                decoded: { userId: parseInt(userId), role }
            });
        } catch (err) {
            console.error('JWT generation failed:', err);
            return res.status(500).json({ error: 'Erreur lors de la génération du token' });
        }
    });
};