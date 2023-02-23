const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const checkAdmin = asyncHandler(async(req, res, next) => {
    try {
        const findTypeAccount = await User.findOne({email: "admin"})

        if (findTypeAccount.isAdmin == "true") {
            next()

        } else {
            res.send("Acesso não autorizado.")
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = {checkAdmin}