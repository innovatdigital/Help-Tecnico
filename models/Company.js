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
    phoneResponsible: {
        type: Number,
        require: true
    },
    phoneCompany: {
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
    number: {
        type: String,
        require: true
    },
    comments: {
        type: String,
        require: true
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
    },
    token: {
        value: {
          type: String,
          default: null
        },
        expiration: {
          type: Date,
          default: null
        }
    },
    refreshToken: {
        type: String,
    },
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Companies', Company);