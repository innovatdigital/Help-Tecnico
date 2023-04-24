const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const groups = asyncHandler(async(req, res) => {
    const findGroups = await User.findById({_id: req.cookies._id})

    res.render('layouts/groups', { isAdmin: findGroups.isAdmin, groups: findGroups.groups, notifications: findGroups.notifications.reverse().slice(0, 5) })
})

module.exports = 
{   groups
}