const post_book = require('./post_book');
const requireWriteAccess = require('../../../middlewares/require_write_access');

module.exports = function(app, limiters) {
    app.post("/api/v2/books", requireWriteAccess, limiters.FIVE_SEC, post_book);
};