const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const config = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    const accounts = []

    find.accountsFb.forEach(account => {
        accounts.push(account)
    })

    find.accountsIg.forEach(account => {
        accounts.push(account)
    })

    res.render('layouts/config', {isAdmin: find.isAdmin, user: find, notifications: find.notifications.reverse().slice(0, 5)})
})

module.exports = 
{   
    config,
}