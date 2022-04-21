const db = require('../util/database');
const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.description, this.imageUrl]);
    };

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static deleteById(id) {
        return db.execute('DELETE FROM products WHERE id = ?', [id]);
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE id = ?', [id]);
    }
}