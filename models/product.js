const fs = require('fs');
const path = require('path');

const pathFile = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

const getProductsFromFile = (callback) => {
    fs.readFile(pathFile, (err, fileContent) => {
        if(err) {
           return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    // constructor(title, price, description, imageUrl, id) {
    //     this.title = title;
    //     this.price = price;
    //     this.description = description;
    //     this.imageUrl = imageUrl;
    //     this.id = id;
    // }

    constructor(title)  {
        this.title = title;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(pathFile, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    };

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

}