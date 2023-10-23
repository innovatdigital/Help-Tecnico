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
        type: String,
        require: true
    },
    phoneCompany: {
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
    neighborhood: {
        type: String,
        require: true
    },
    service: {
        type: String,
        require: true
    },
    technician: {
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
    avatar: {
        type: String,
        default: "" 
    },
    createdAtFormatted: {
        type: String,
        require: true
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
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Companies', Company);