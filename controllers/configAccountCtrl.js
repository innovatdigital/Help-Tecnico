const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const config = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/config', {isAdmin: find.isAdmin, user: find, notifications: find.notifications.reverse().slice(0, 5)})
})

const updateAccount = asyncHandler(async(req, res) => {
    try {
        const update = await User.findByIdAndUpdate(req.cookies._id, {name: req?.body?.name, cpf: req?.body?.cpf, number: req?.body?.number, email: req?.body?.email, password: req?.body?.password})

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})


module.exports = 
{   
    config,
    updateAccount
}