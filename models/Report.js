const mongoose = require('mongoose')

const Report = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    id_admin: {
        type: String,
        require: true
    },
    photos: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        default: []
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Reports', Report);
