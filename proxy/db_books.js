const books = require('../mockDB/books');

module.exports = {
    getAll: async () => {
        return books;
    },
    getById: async (id) => {
        return books.find(book => book.id === id);
    },
    create: async (bookData) => {
        const newBook = {
            id: books.length ? books[books.length - 1].id + 1 : 1,
            ...bookData
        };
        books.push(newBook);
        return newBook;
    },
    updateById: async (id, bookData) => {
        const index = books.findIndex(book => book.id === id);
        if (index === -1) {
            throw new Error("Book not found");
        }
        books[index] = { id, ...bookData };
        return books[index];
    },
    deleteById: async (id) => {
        const index = books.findIndex(book => book.id === id);
        if (index === -1) {
            throw new Error("Book not found");
        }
        const deletedBook = books.splice(index, 1);
        return deletedBook[0];
    }
};