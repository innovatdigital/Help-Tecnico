const mongoose = require('mongoose')

const Finances = new mongoose.Schema({
    idUser: {
        type: String,
        require: true
    },
    value: {
        type: Number,
        require: true
    },
    day: {
        type: String,
        require: true
    },
    month: {
        type: String,
        require: true
    },
    year: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: "Aprovado"
    },
    plan: {
        type: String,
        require: true
    },
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Finances', Finances);
