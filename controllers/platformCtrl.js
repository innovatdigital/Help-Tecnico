const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Posts = require('../models/Posts')
const Feedbacks = require('../models/Feedbacks')

const dashboard = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)
    const listPosts = []

    find.accountsFb.forEach(account => {
        account.posts.forEach(post => {
            listPosts.push(post)
        })
    })

    if (find.isAdmin) {
        const users = await User.countDocuments({})
        const usersRecent = await User.find({}).limit(10)
        const posts = await Posts.countDocuments({})
        const postsRecents = await Posts.find({})
        const feedbacks = await Feedbacks.countDocuments({})

        res.render('layouts/dashboard', {isAdmin: true, totalUsers: users, totalPosts: posts, totalFeedbacks: feedbacks, usersRecent: usersRecent, postsRecents: postsRecents, posts: listPosts})
    } else {
        let total_groups = 0
        let total_posts = 0 
        
        find.accountsFb.forEach(account => {
            total_groups = total_groups + account.groups.length
            total_posts = total_posts + account.posts.length
        })

        find.accountsIg.forEach(account => {
            total_posts = total_posts + account.posts.length
        })

        res.render('layouts/dashboard', {isAdmin: false, type_account: find.type_account, posts: listPosts, total_accounts: find.accountsFb.length + find.accountsIg.length, total_groups: total_groups, total_posts: total_posts})
    }
})

const allPosts = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)
    
    const listPosts = []

    find.accountsFb.forEach(account => {
        account.posts.forEach(post => {
            listPosts.push(post)
        })
    })

    if (find.isAdmin) {
        res.render('layouts/posts', {isAdmin: true, posts: listPosts})
    } else {
        res.render('layouts/posts', {isAdmin: false, posts: listPosts})
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