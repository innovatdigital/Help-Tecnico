const mongoose = require('mongoose')

const Supplier = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    landline: {
        type: String,
        require: true
    },
    phone: {
        type: String,
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
    avatar: {
        type: String,
        default: "" 
    },
    materials: {
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
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Suppliers', Supplier);