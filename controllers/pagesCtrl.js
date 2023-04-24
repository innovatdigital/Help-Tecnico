const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const pages = asyncHandler(async(req, res) => {
    const findPages = await User.findById({_id: req.cookies._id})

    res.render('layouts/pages', { isAdmin: findPages.isAdmin, pages: findPages.accountsFb, notifications: findPages.notifications.reverse().slice(0, 5) })
})

module.exports = 
{   pages,
}