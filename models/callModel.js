const mongoose = require('mongoose')
const { Schema } = mongoose;

const Call = new mongoose.Schema({
    description: {
        type: String,
    },
    idCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Companies'
    },
    idTechnician: {
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
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    status: {
        type: String,
    },
    code: {
        type: Number,
    },
    confirmCode: {
        type: Boolean,
        default: false
    },
    nameCompany: {
        type: String,
    },
    avatarCompany: {
        type: String,
    },
    emailCompany: {
        type: String,
    },
    phoneCompany: {
        type: String,
    },
    nameTechnician: {
        type: String,
    },
    avatarTechnician: {
        type: String,
    },
    sla: {
        type: String,
    },
    cancellationMessage: {
        type: String,
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Calls', Call);