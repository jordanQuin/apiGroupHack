const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const app = express();
const PORT = 3000;

// Middleware pour lire le JSON dans les requêtes
app.use(express.json());

const cors = require("cors");
app.use(cors({
  origin: "*", // FAILLE 1: CORS Misconfiguration - accepte toutes les origines
  credentials: true
}));

require("dotenv").config();

app.use(cookieParser());

const limiters = {
  ONE_SEC: rateLimit({limit: 10, windowMs: 1000}), // 10 requêtes par seconde pour les tests
  FIVE_SEC: rateLimit({limit: 5, windowMs: 5000}),
  WEAK_LIMIT: rateLimit({limit: 1000, windowMs: 1000}), // FAILLE 2: Rate limiting très faible
};

// Importer et utiliser les routes des voitures
const carsRoutes = require("./api/cars/index");
carsRoutes(app, limiters);

// Routes d'authentification
const authRoutes = require("./api/auth/routes");
authRoutes(app, limiters);

// Routes dev
if (process.env.NODE_ENV !== "production") {
  const devRoutes = require("./api/dev/routes");
  devRoutes(app);
}

function errorHandler (err, req, res, next) {
  console.error('ERROR LOG:', err);
  // FAILLE 3: Exposition d'erreurs détaillées
  res.status(500).send('Unhandled server error: ' + err.message + '\n' + err.stack);
}

app.use(errorHandler);

// Capturer les erreurs hors express
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur de gestion des voitures lancé sur http://localhost:${PORT}`);
});