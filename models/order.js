const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {type: Object, required: true},
            quantity: {type: Number, required: true},
        }
    ],
    user: {
        email: {type: String, required: true},
        userId: {type: Schema.Types.ObjectId, required: true},
    },
});

module.exports = moongoose.model('Order', orderSchema);