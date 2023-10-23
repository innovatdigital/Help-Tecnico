const mongoose = require('mongoose')
const { Schema } = mongoose;

const Budget = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    equipments: {
        type: Array,
        default: []
    },
    idCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Companies'
    },
    value: {
        type: String,
        require: true
    },
    expiration: {
        type: Date
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Budgets', Budget);
