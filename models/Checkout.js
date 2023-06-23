const mongoose = require('mongoose')

const Checkout = new mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    number: {
        type: String,
        require: true
    },
    cpf: {
        type: String,
        require: true
    },
    id_payment: {
        type: String,
        require: true
    },
    plan: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    customer: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    },
    {
        versionKey: false,
    }
)

module.exports = mongoose.model('Checkout', Checkout);
