const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Posts = require('../models/Posts')
const axios = require('axios')


const allPosts = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/posts', {isAdmin: find.isAdmin, posts: find.posts.reverse().slice(0, 50), notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name})
})

const viewPost = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    const findPostInUser = find.posts.find(post => post.id_post == req.params.id)

    if (findPostInUser) {
        res.render("layouts/viewPost", { isAdmin: find.isAdmin, name_user: find.name, photo: find.photo, notifications: find.notifications.reverse(), post: findPostInUser, name_user: find.name })
    } else {
        res.redirect("/platform")
    }
})

const editPostScheduleLink = asyncHandler(async(req, res) => {
    try {
        const find = await User.findById(req.cookies._id)

        const findPostInUser = find.posts.find(post => post.id_post == req.params.id)

        if (findPostInUser) {
            const data = {
                _id: req.cookies._id,
                "posts.id_post": req.params.id
            };

            const day_split = req.body.day.split('-')

            const replace = {
                $set: {
                    "posts.$.link": req.body.link,
                    "posts.$.content": req.body.content,
                    "posts.$.day": day_split[2] + '/' + day_split[1] + '/' + day_split[0],
                    "posts.$.hour": req.body.hour,
                    "posts.$.time": req.body.time
                }
            };
    
            const update = await User.findOneAndUpdate(data, replace, { new: true })

            const updatePost = await Posts.findOneAndUpdate({id_post: req.params.id}, {
                "link": req.body.link,
                "content": req.body.content,
                "day": day_split[2] + '/' + day_split[1] + '/' + day_split[0],
                "hour": req.body.hour,
                "time": req.body.time,
            }, { new: true })

            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

const editPostScheduleImage = asyncHandler(async(req, res) => {
    try {
        const find = await User.findById(req.cookies._id)

        const findPostInUser = find.posts.find(post => post.id_post == req.params.id)

        if (findPostInUser) {
            const data = {
                _id: req.cookies._id,
                "posts.id_post": req.params.id
            };

            const day_split = req.body.day.split('-')

            const replace = {
                $set: {
                    "posts.$.content": req.body.content,
                    "posts.$.day": day_split[2] + '/' + day_split[1] + '/' + day_split[0],
                    "posts.$.hour": req.body.hour,
                    "posts.$.time": req.body.time
                }
            };
    
            const update = await User.findOneAndUpdate(data, replace, { new: true })

            const updatePost = await Posts.findOneAndUpdate({id_post: req.params.id}, {
                "content": req.body.content,
                "day": day_split[2] + '/' + day_split[1] + '/' + day_split[0],
                "hour": req.body.hour,
                "time": req.body.time,
            }, { new: true })

            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

const editPostPublished = asyncHandler(async(req, res) => {
    try {
        const find = await User.findById(req.cookies._id)

        const findPostInUser = find.posts.find(post => post.id_post == req.params.id)

        if (findPostInUser) {
            const data = {
                _id: req.cookies._id,
                "posts.id_post": req.params.id
            };

            const replace = {
                $set: {
                    "posts.$.content": req.body.content,
                }
            };
    
            const update = await User.findOneAndUpdate(data, replace, { new: true })

            const updatePost = await Posts.findOneAndUpdate({id_post: req.params.id}, {
                "content": req.body.content,
            }, { new: true })

            const ids = updatePost.ids_posts_pages_and_groups

            if (ids.length > 0) {
                ids.forEach(async(item) => {
                    const data = item.split("_")
                    const postId = `${data[0]}_${data[1]}`
                    const accessToken = `${data[2]}`
                    const type = `${data[3]}`

                    if (type == "page") {
                        try {
                            const response = await axios.post(`https://graph.facebook.com/v14.0/${postId}?message=${req.body.content}&access_token=${accessToken}`);

                            res.sendStatus(200)
                        } catch (err) {
                            res.sendStatus(500)
                        }
                    }
                })
            } else {
                res.sendStatus(200)
            }
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

const deletePost = asyncHandler(async(req, res) => {
    try {
        const find = await User.findById(req.cookies._id)

        const findPostInUser = find.posts.find(post => post.id_post == req.params.id)

        if (findPostInUser) {
            const data = {
                _id: req.cookies._id,
                "posts.id_post": req.params.id
            };
            
            const replace = {
                $pull: {
                    posts: {
                        "id_post": req.params.id,
                    }
                }
            };
    
            const update = await User.findOneAndUpdate(data, replace, { new: true })

            const updatePost = await Posts.findOneAndDelete({id_post: req.params.id})

            const ids = updatePost.ids_posts_pages_and_groups

            if (ids.length > 0) {
                ids.forEach(async(item) => {
                    const data = item.split("_")
                    const postId = `${data[0]}_${data[1]}`
                    const accessToken = `${data[2]}`
                    const type = `${data[3]}`

                    if (type == "page") {
                        try {
                            const response = await axios.delete(`https://graph.facebook.com/v14.0/${postId}`, {
                                params: {
                                    access_token: accessToken,
                                },
                            });

                            res.sendStatus(200)
                        } catch (err) {
                            res.sendStatus(500)
                        }
                    }
                })
            } else {
                res.sendStatus(200)
            }
        } else {
            res.redirect("/platform")
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = 
{
    allPosts,
    viewPost,
    editPostScheduleLink,
    editPostScheduleImage,
    editPostPublished,
    deletePost
}