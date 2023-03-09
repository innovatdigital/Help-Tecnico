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
    name_account: {
        type: String,
        require: true
    },
    image_account: {
        type: String,
        require: true
    },
    image: {
        type: Array,
        require: true
    },
    status_bot: {
        type: Boolean,
        require: true
    },
    day: {
        type: String,
        require: true
    },
    hour: {
        type: String,
        require: true
    },
    groups: {
        type: Array,
        require: true
    },
    page_id: {
        type: String,
        require: true
    },
    platform: {
        type: String,
        require: true
    },
    page_name: {
        type: String,
        require: true  
    },
    content: {
        type: String,
        require: true
    },
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Posts', Posts);
