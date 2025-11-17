const { signup, login } = require('./handlers');

module.exports = function(app, limiters) {
    // Route 1: Inscription sécurisée
    app.post("/api/v1/auth/signup", limiters.FIVE_SEC, signup);
    
    // Route 2: Connexion sécurisée  
    app.post("/api/v1/auth/login", limiters.FIVE_SEC, login);
};