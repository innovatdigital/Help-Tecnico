const mongoose = require('mongoose')

const Comments = new mongoose.Schema({
    id_user: {
        type: String,
        require: true
    },
    id_post: {
        type: String,
        require: true
    },
    id_account: {
        type: Number,
        require: true
    },
    content_comment: {
        type: String,
        require: true
    },
    limit_comments: {
        type: Number,
        require: true
    },
    platform: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    comments: {
        type: Array,
        default: []
    },
    count: {
        type: Number,
        default: 0
    }
    },
    {
        versionKey: false,
    }
)

module.exports = mongoose.model('Comments', Comments);
