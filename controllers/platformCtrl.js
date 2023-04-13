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

        res.render('layouts/dashboard', {isAdmin: true, totalUsers: users, totalPosts: posts, totalFeedbacks: feedbacks, usersRecent: usersRecent, postsRecents: postsRecents, posts: find.posts.reverse()})
    } else {
        res.render('layouts/dashboard', {isAdmin: false, type_account: find.type_account, posts: find.posts.reverse(), total_accounts: find.accountsFb.length + find.accountsIg.length, total_groups: find.groups.length, total_posts: find.posts.length})
    }
})

const allPosts = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    if (find.isAdmin) {
        res.render('layouts/posts', {isAdmin: true, posts: find.posts.reverse()})
    } else {
        res.render('layouts/posts', {isAdmin: false, posts: find.posts.reverse()})
    }
})

const logout = asyncHandler(async(req, res) => {
    res.cookie('_id', '', { expires: new Date(0) })
    res.redirect("/login")
})

module.exports = 
{   dashboard,
    allPosts,
    logout
}