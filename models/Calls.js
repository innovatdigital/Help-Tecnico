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
    timeline: {
        type: Array,
        default: []
    },
    reports: {
        type: Array,
        default: []
    },
    date: {
        type: String,
        require: true
    },
    start_time: {
        type: String,
        require: true
    },
    end_time: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    name_company: {
        type: String,
        require: true
    },
    logo_company: {
        type: String,
        require: true
    },
    sla: {
        type: String,
        require: true
    },
    cancellation_message: {
        type: String,
        require: true
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Calls', Call);