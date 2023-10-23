const mongoose = require('mongoose')

const Admin = new mongoose.Schema({
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    comments: {
        type: String,
    },
    roles: {
        type: Array,
        default: ["ADMIN"]
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "" 
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
    createdAtFormatted: {
        type: String
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Admin', Admin);
