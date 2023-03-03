const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const checkAdmin = asyncHandler(async(req, res, next) => {
    try {
        const findTypeAccount = await User.findById(req.cookies._id)

        if (findTypeAccount.isAdmin == true) {
            next()

        } else {
            res.send("Acesso não autorizado.")
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = {checkAdmin}