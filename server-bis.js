const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const app = express();
const PORT = 3000;

// Middleware pour lire le JSON dans les requêtes
app.use(express.json());

const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

require("dotenv").config();

if (process.env.NODE_ENV !== "production") {
  const devRoutes = require("./api/dev/routes");
  devRoutes(app);
}

app.use(cookieParser());

const limiters = {
  ONE_SEC: rateLimit({limit: 1, windowMs: 1000}),
  FIVE_SEC: rateLimit({limit: 1, windowMs: 5000}),
};

// Importer et utiliser les routes des livres
const booksRoutes = require("./api/books/index");
booksRoutes(app, limiters);

function errorHandler (err, req, res, next) {
  console.error('ERROR LOG:', err);
  res.send('Unhandled server error ' + err.message);
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
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});