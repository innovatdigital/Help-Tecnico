const mongoose = require('mongoose')

const Admin = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    comments: {
        type: String,
        require: true
    },
    roles: {
        type: Array,
        default: ["ADMIN"]
    },
    isAdmin: {
        type: Boolean,
        default: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    notifications: {
        type: Array,
        default: []
    },
    photo: {
        type: String,
        default: "" 
    },
    notificationEmail: {
        type: Boolean,
        default: true
    },
    token: {
        value: {
          type: String,
          default: null
        },
        expiration: {
          type: Date,
          default: null
        }
    },
    refreshToken: {
        type: String,
    },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Admins', Admin);
