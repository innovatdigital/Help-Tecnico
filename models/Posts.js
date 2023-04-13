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
        type: String,
        require: true
    },
    status_bot: {
        type: Boolean,
        require: true
    },
    program: {
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
    pages_ids: {
        type: Array,
        require: true
    },
    platform: {
        type: String,
        require: true
    },
    ids_posts_pages_and_groups: {
        type: Array,
        require: true  
    },
    content: {
        type: String,
        require: true
    },
    path_image: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    },
    published: {
        type: Boolean,
        require: true
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('Posts', Posts);
