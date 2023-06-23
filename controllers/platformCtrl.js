const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Posts = require('../models/Posts')
const Access = require('../models/Access')
const Feedbacks = require('../models/Feedbacks')

const dashboard = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/dashboard', {isAdmin: find.isAdmin, type_account: find.type_account, posts: find.posts.reverse().slice(0, 10), total_accounts: find.accountsFb.length + find.accountsIg.length, total_groups: find.groups.length, total_posts: find.posts.length, notifications: find.notifications.reverse().slice(0, 5), historic: find.historic.reverse().slice(0, 10), photo: find.photo, name_user: find.name})
})

const notifications = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)
    const deleteNotifications = await User.findByIdAndUpdate(req.cookies._id, {
        $set: {
            notifications: []
        }
    });

    res.render('layouts/notifications', {isAdmin: find.isAdmin, notifications: find.notifications.reverse(), photo: find.photo, name_user: find.name})
})

const logout = asyncHandler(async(req, res) => {
    const cookies = req.cookies;

    for (const cookieName in cookies) {
      res.clearCookie(cookieName, { 
        path: '/', 
        domain: 'plubee.net'
      });
    }
    res.redirect('/');
})

module.exports = 
{   dashboard,
    notifications,
    logout
}