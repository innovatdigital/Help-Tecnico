const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Posts = require('../models/Posts')
const Feedbacks = require('../models/Feedbacks')

const dashboard = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    if (find.isAdmin) {
        const users = await User.countDocuments({})
        const usersRecent = await User.find({}).limit(10)
        const posts = await Posts.countDocuments({})
        const postsRecents = await Posts.find({})
        const feedbacks = await Feedbacks.countDocuments({})

        res.render('layouts/dashboard', {isAdmin: true, totalUsers: users, totalPosts: posts, totalFeedbacks: feedbacks, usersRecent: usersRecent, postsRecents: postsRecents, posts: find.posts.reverse().slice(0, 10), notifications: find.notifications.reverse().slice(0, 5), historic: find.historic.reverse().slice(0, 10)})
    } else {
        res.render('layouts/dashboard', {isAdmin: false, type_account: find.type_account, posts: find.posts.reverse().slice(0, 10), total_accounts: find.accountsFb.length + find.accountsIg.length, total_groups: find.groups.length, total_posts: find.posts.length, notifications: find.notifications.reverse().slice(0, 5), historic: find.historic.reverse().slice(0, 10)})
    }
})

const allPosts = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    if (find.isAdmin) {
        res.render('layouts/posts', {isAdmin: true, posts: find.posts.reverse(), notifications: find.notifications.reverse().slice(0, 5)})
    } else {
        res.render('layouts/posts', {isAdmin: false, posts: find.posts.reverse(), notifications: find.notifications.reverse().slice(0, 5)})
    }
})

const notifications = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/notifications', {isAdmin: find.isAdmin, notifications: find.notifications.reverse()})

})

const logout = asyncHandler(async(req, res) => {
    res.cookie('_id', '', { expires: new Date(0) })
    res.redirect("/login")
})

module.exports = 
{   dashboard,
    allPosts,
    notifications,
    logout
}