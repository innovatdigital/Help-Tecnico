const mongoose = require('mongoose')

const Call = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    id_company: {
        type: String,
        require: true
    },
    id_technician: {
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
    status: {
        type: String,
        require: true
    },
    sla: {
        type: String,
        require: true
    }
    },
    {
        versionKey: false,
    }
)

module.exports = mongoose.model('Calls', Call);