const mongoose = require('mongoose')

const Images = new mongoose.Schema({
    img: {
        type: String
    },
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Images', Images);
