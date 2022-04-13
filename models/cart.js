const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, '../data/cart.json');

module.exports = class Cart {

    static addProduct(id, productPrice) {
        fs.readFile(pathToFile, (err, fileContent) => {
           let cart = {products:[], totalPrice: 0};
           if(!err) {
               cart = JSON.parse(fileContent);
           }
           const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
           const existingProduct = cart.products[existingProductIndex];
           let updatedProduct;
           if(existingProduct) {
               updatedProduct = {...existingProduct};
               updatedProduct.qty++;
               cart.products = [...cart.products];
               cart.products[existingProductIndex] = updatedProduct;
           } else {
               updatedProduct = {id, qty: 1};
               cart.products = [...cart.products, updatedProduct];
           }
           cart.totalPrice = cart.totalPrice + +productPrice;
           fs.writeFile(pathToFile, JSON.stringify(cart), err => {
               console.log(err);
           });
        });
    }
}