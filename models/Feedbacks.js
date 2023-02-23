const mongoose = require('mongoose')

const Feedbacks = new mongoose.Schema({
    idUser: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Feedbacks', Feedbacks);
