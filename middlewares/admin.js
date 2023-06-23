const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const checkAdmin = asyncHandler(async(req, res, next) => {
    try {
        const findTypeAccount = await User.findById(req.cookies._id)

        if (findTypeAccount.isAdmin) {
            next()
        } else {
            res.status(404).render('layouts/not_found')
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = {checkAdmin}