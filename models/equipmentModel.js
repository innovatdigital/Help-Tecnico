const mongoose = require('mongoose')
const { Schema } = mongoose;

const Equipment = new mongoose.Schema({
    model: {
        type: String
    },
    brand: {
        type: String
    },
    sector: {
        type: String
    },
    local: {
        type: String
    },
    evaporator: {
        type: String
    },
    fluid: {
        type: String
    },
    activity: {
        type: String
    },
    btus: {
        type: String
    },
    imageFile: {
        type: String
    },
    idCompany: {
        type: Schema.Types.ObjectId,
        ref: 'Companies'
    },
    status: {
        type: String
    },
    nameCompany: {
        type: String
    },
    avatarCompany: {
        type: String
    },
    createdAtFormatted: {
        type: String
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Equipments', Equipment);
