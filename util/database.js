const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://andrei:R9LeoQS78jgS0g04@nodejscompletecourseclu.xgbdg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const mongoConnect = (callback) => {
    client.connect()
    .then(clientCb => {
        console.log('Connected to MongoDB');
        callback(clientCb);
    }).catch(error => {
        console.log(error);
    });
};

module.exports = mongoConnect;