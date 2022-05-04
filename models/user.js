const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    return getDb().collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if(cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity +1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {items: updatedCartItems};

    // const updatedCart = {items: [{...product, quantity: 1}]}
    const db = getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: updatedCart}});
  };

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(item => {
      return item.productId;
    });
    return db.collection('products').find({_id: {$in: productIds}}).toArray()
        .then(products => {
          return products.map(product => {
            return {
              ...product,
              quantity: this.cart.items.find(item => {
                return item.productId.toString() === product._id.toString();
              }).quantity
            }
          });
        })
  }

  static findById(id) {
    return getDb().collection('users').findOne({ _id: new mongodb.ObjectId(id) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteItemFromCart(id) {
    const updateCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== id.toString()
    });
    const db = getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: {items: updateCartItems}}})
        .then(result => {
          console.log(result);
        }).catch(err => {
          console.log(err);
        });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
        .then(products => {
          const order = {
            items: products,
            user: {
              _id: new mongodb.ObjectId(this._id),
              name: this.name
            }
          };
          return db.collection('orders').insertOne(order);
        })
        .then(result => {
          this.cart = {items: []};
          return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: {items: []}}});
        })
        .catch(err => {
          console.log(err);
        });
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find({'user._id': new mongodb.ObjectId(this._id)})
        .toArray()
        .then(orders => {
          return orders;
        })
        .catch(err => {
          console.log(err);
        });
  }
}

module.exports = User;
