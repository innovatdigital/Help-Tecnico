const mongoose = require('mongoose')

const Call = new mongoose.Schema({
    description: {
        type: String,
    },
    id_company: {
        type: String,
    },
    id_technician: {
        type: String,
    },
    photos: {
        type: Array,
        default: []
    },
    equipments: {
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
    },
    start_time: {
        type: String,
    },
    end_time: {
        type: String,
    },
    status: {
        type: String,
    },
    code: {
        type: Number,
    },
    confirmed_code: {
        type: Boolean,
        default: false
    },
    name_company: {
        type: String,
    },
    logo_company: {
        type: String,
    },
    email_company: {
        type: String,
    },
    phone_company: {
        type: String,
    },
    logo_company: {
        type: String,
    },
    name_technician: {
        type: String,
    },
    photo_technician: {
        type: String,
    },
    sla: {
        type: String,
    },
    cancellation_message: {
        type: String,
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Calls', Call);