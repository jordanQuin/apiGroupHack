const get_books = require('./get_books');
const get_book = require('./get_book');
const post_book = require('./post_book');
const put_book = require('./put_book');
const delete_book = require('./delete_book');
const requireWriteAccess = require('../../../middlewares/require_write_access');

module.exports = function(app, limiters) {
    app.get("/api/v1/books", limiters.ONE_SEC, get_books);
    app.get("/api/v1/books/:id", limiters.ONE_SEC, get_book);
    app.post("/api/v1/books", requireWriteAccess, limiters.FIVE_SEC, post_book);
    app.put("/api/v1/books/:id", requireWriteAccess, limiters.FIVE_SEC, put_book);
    app.delete("/api/v1/books/:id", requireWriteAccess, limiters.FIVE_SEC, delete_book);
};