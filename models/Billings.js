const mongoose = require('mongoose')

const Billing = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    value: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Billings', Billing);
