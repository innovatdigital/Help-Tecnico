const mongoose = require('mongoose')

const Supplier = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    landline: {
        type: Number,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    contactName: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        default: "" 
    },
    type: {
        type: Array,
        default: [] 
    },
    address: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true 
    },
    cep: {
        type: String,
        require: true 
    },
    comments: {
        type: String,
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Suppliers', Supplier);