const mongoose = require('mongoose')

const Technician = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    cpf: {
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
        default: ["TECHNICIAN"]
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
    comments: {
        type: String,
        require: true
    },
    calls: {
        type: Array,
        default: []
    },
    responsibleCompanies: {
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

module.exports = mongoose.model('Technicians', Technician);