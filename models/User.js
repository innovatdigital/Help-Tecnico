const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    cpf: {
        type: String,
        require: true
    },
    number: {
        type: Number,
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
    date: {
        type: String,
        require: true
    },
    groups: {
        type: Array,
        default: []
    },
    posts: {
        type: Array,
        default: []
    },
    accountsFb: {
        type: Array,
        default: []
    },
    accountsIg: {
        type: Array,
        default: []
    },
    type_account: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false
    },
    isBloqued: {
        type: Boolean,
        default: false
    },
    notifications: {
        type: Array,
        default: []
    },
    historic: {
        type: Array,
        default: []
    },
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Users', User);
