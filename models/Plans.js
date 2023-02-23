const mongoose = require('mongoose')

const Plans = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    value_month: {
        type: String,
        require: true
    },
    description: {
        type: Array,
        require: true
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Plans', Plans);
