const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {    
  const jwtToken =
    req.cookies?.jwtToken ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!jwtToken) return res.status(401).json({ message: "Missing token" });

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token error" });

    req.userId = decoded.userId;
    next();
  });
};
