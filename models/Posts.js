const mongoose = require('mongoose')

const Posts = new mongoose.Schema({
    id_post: {
        type: String,
        require: true
    },
    id_user: {
        type: String,
        require: true
    },
    id_account: {
        type: String,
        require: true
    },
    name_user: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    status_bot: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    platform: {
        type: String,
        require: true
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Posts', Posts);
