const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const tutorials = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render("layouts/postInstagram", { isAdmin: find.isAdmin, notifications: find.notifications.reverse().slice(0, 5) })
})

module.exports = {
    tutorials
}