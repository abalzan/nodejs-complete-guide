const { MongoClient, ServerApiVersion } = require('mongodb');

let _db;
const uri = "mongodb+srv://andrei:R9LeoQS78jgS0g04@nodejscompletecourseclu.xgbdg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const mongoConnect = (callback) => {
    client.connect()
    .then(client => {
        console.log('Connected to MongoDB');
        _db = client.db();
        callback();
    }).catch(error => {
        console.log(error);
        throw error;
    });
};
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;