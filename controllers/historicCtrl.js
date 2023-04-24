const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const historic = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/historic', {isAdmin: find.isAdmin, historic: find.historic, notifications: find.notifications.reverse().slice(0, 5)})
})

module.exports = 
{   historic,
}