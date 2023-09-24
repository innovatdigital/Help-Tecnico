const mongoose = require('mongoose')

const Archive = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    path: {
        type: String,
        require: true
    },
    archives: {
        type: Array,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Archives', Archive);
