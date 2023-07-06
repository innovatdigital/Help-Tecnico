const mongoose = require('mongoose')

const Company = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    cnpj: {
        type: String,
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
    password: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    roles: {
        type: Array,
        default: ["COMPANY"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    notifications: {
        type: Array,
        default: []
    },
    photo: {
        type: String,
        default: "" 
    },
    notificationEmail: {
        type: Boolean,
        default: true
    },
    calls: {
        type: Array,
        default: []
    },
    budgets: {
        type: Array,
        default: []
    },
    equipments: {
        type: Array,
        default: []
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Companies', Company);