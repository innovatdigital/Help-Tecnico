const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Posts = require('../models/Posts')
const Feedbacks = require('../models/Feedbacks')

const dashboard = asyncHandler(async(req, res) => {
    const find = await User.findOne({email: "admin"})

    if (find.isAdmin == "true") {
        const users = await User.countDocuments({})
        const usersRecent = await User.find({}).limit(10)
        const posts = await Posts.countDocuments({})
        const postsRecents = await Posts.find({})
        const feedbacks = await Feedbacks.countDocuments({})

        res.render('layouts/dashboard', {isAdmin: true, totalUsers: users, totalPosts: posts, totalFeedbacks: feedbacks, usersRecent: usersRecent, postsRecents: postsRecents})
    } else {
        res.render('layouts/dashboard', {isAdmin: false, type_account: find.type_account})
    }
})

const allPosts = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)
    const posts = await Posts.find({id_user: req.cookies._id}).lean()
    
    const listPosts = []

    posts.forEach(post => {
        listPosts.push(post)
    })

    if (find.isAdmin == "true") {
        res.render('layouts/posts', {isAdmin: true, posts: posts})
    } else {
        res.render('layouts/posts', {isAdmin: false, posts: posts})
    }
})

module.exports = 
{   dashboard,
    allPosts
}