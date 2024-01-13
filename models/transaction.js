const mongoose = require('mongoose');
const Schema = mongoose.Schema

const Transaction = new Schema({
    userRes: {
        type: String,
        required: true
    },
    wishlist: [{
        type: String
    }],
    cart: [{
        type: String
    }],
    buy: [{
        type: String
    }],
},{
    timestamps:true
})

module.exports = mongoose.model('Transaction',Transaction)