const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../proxy/db');
const Joi = require('joi');

// Validation schema sécurisée
const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */
const signup = async (req, res) => {
    try {
        // Validation sécurisée
        const { error } = signupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Cet email est déjà utilisé" });
        }

        // Hasher le mot de passe de façon sécurisée
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await db.createUser({
            email,
            password: hashedPassword,
            role: 'user'
        });

        // Ne pas retourner le mot de passe
        const { password: _, ...userResponse } = newUser;
        res.status(201).json({ 
            message: "Utilisateur créé avec succès", 
            user: userResponse 
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
const login = async (req, res) => {
    try {
        // Validation sécurisée
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, password } = req.body;

        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        // Générer un JWT sécurisé
        const token = jwt.sign(
            { userId: user.id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h', algorithm: 'HS256' }
        );

        // Cookie sécurisé
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 1000 // 1 hour
        };

        res.cookie('jwtToken', token, cookieOptions);
        res.json({ 
            message: "Connexion réussie", 
            user: { id: user.id, email: user.email, role: user.role } 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

module.exports = { signup, login };