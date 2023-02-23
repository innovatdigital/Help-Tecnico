const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const checkLogin = asyncHandler(async(req, res, next) => {
    try {
        if (req.cookies._id) {
            const find = await User.findById(req.cookies._id)

            if (find != null && find.isBloqued == false) {
                res.redirect('/platform');
            } else {
                res.redirect('/login');
            }

        } else {
            next()
        }
    } catch (err) {
        next()
    }
})

const auth = asyncHandler(async(req, res, next) => {
    try {
        if (req.cookies._id) {
            const find = await User.findById(req.cookies._id)

            if (find != null && find.isBloqued == false) {
                next()
            } else {
                res.redirect('/login');
            }

        } else {
            res.redirect('/login');
        }
    } catch (err) {
        res.send('Error')
    }
})

module.exports = { 
    checkLogin,
    auth
}