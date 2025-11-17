const jwt = require("jsonwebtoken");

// Middleware d'authentification sécurisé
module.exports = (req, res, next) => {    
  const jwtToken =
    req.cookies?.jwtToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!jwtToken) {
    return res.status(401).json({ message: "Token d'authentification requis" });
  }

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};