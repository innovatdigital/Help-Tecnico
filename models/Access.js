const mongoose = require('mongoose')

const Access = new mongoose.Schema({
    country: {
        type: String,
        require: true
    },
    region: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    ll: {
        type: Array,
        require: true
    },
    date: {
        type: String,
        require: true
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Access', Access);
