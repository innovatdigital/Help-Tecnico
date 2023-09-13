const mongoose = require('mongoose')

const Budget = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    idEquipment: {
        type: String,
    },
    idCompany: {
        type: String,
    },
    value: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    expiration: {
        type: Date,
        default: Date.now()
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Budgets', Budget);
