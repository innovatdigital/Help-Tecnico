const mongoose = require('mongoose')
const { Schema } = mongoose;

const Report = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    idTechnician: {
        type: Schema.Types.ObjectId,
        ref: 'Technicians'
    },
    photos: {
        type: Array,
        default: []
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Reports', Report);
