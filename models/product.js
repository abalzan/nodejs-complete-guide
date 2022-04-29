const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        if (this._id) {
            return this.update(this._id, this);
        }
        return getDb().collection('products').insertOne(this)
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });
    }

    update(id, product) {
        const db = getDb();
        return db.collection('products').updateOne({_id: this._id}, {$set: product})
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        return getDb().collection('products').find().toArray()
            .then(products => {
                return products;
            }).catch(err => {
                console.log(err);
            });
    }

    static findById(id) {
        return getDb().collection('products').findOne({_id: new mongodb.ObjectId(id)})
            .then(product => {
                return product;
            }).catch(err => {
                console.log(err);
            });
    }

    static deleteById(id) {
        return getDb().collection('products').deleteOne({_id: new mongodb.ObjectId(id)})
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });
    }
}

module.exports = Product;