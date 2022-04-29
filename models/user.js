const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    return getDb().collection('users').insertOne(this);
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
}

module.exports = User;
