const jwt = require('jsonwebtoken');
const { swaggerUi, swaggerSpec } = require("../../config/swagger.js");

module.exports = function(app) {
    app.get('/api/dev/token', (req, res) => {
        const options = { expiresIn: '1h' };
        try {
            const token = jwt.sign({ userId: 'mockedUserId' }, process.env.JWT_SECRET, options);

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 1000 // 1 hour
            };

            res.cookie('jwtToken', token, cookieOptions);
            return res.json({ message: "Jeton transmis" });
        } catch (err) {
            console.error('JWT generation failed:', err);
            return res.status(500).json({ error: 'token generation failed' });
        }
    });
    app.use("/api/dev/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}