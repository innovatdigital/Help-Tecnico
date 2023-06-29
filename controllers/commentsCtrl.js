const asyncHandler = require('express-async-handler')
const Posts = require('../models/Posts')
const User = require('../models/User')
const Comments = require('../models/Comments')

const comments = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/comments', {isAdmin: find.isAdmin, type_account: find.type_account, posts: find.posts.reverse(), notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name})
})

const activeBot = asyncHandler(async(req, res) => {
    try {
        const { id_post, contents, limit_comments } = req.body

        User.findOneAndUpdate(
            { _id: req.cookies._id, 'posts.id_post': id_post },
            { $set: { 'posts.$.status_bot': true, 'posts.$.contents': contents } },
            { new: true }
        )
        .then(result => {
            const newActiveBot = Comments.create({id_user: req.cookies._id, id_post: id_post, contents: contents, limit_comments: parseInt(limit_comments)}, async(error, result) => {
                if (error) {
                    console.error(error);
                    res.sendStatus(500)
                } else {
                    const update = await Posts.findOneAndUpdate({id_post: id_post}, {status_bot: true})
                    res.sendStatus(200)
                }
            })    
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500)
        });
    } catch (err) {
        res.sendStatus(500)
    }
})

const disableBot = asyncHandler(async(req, res) => {
    try {
        User.findOneAndUpdate(
            { _id: req.cookies._id, 'posts.id_post': req.params.id_post },
            { $set: { 'posts.$.status_bot': false } },
            { new: true }
        )
        .then(result => {
            const newActiveBot = Comments.findOneAndDelete({id_post: req.params.id_post}, async(error, result) => {
                if (error) {
                    console.error(error);
                    res.sendStatus(500)
                } else {
                    const update = await Posts.findOneAndUpdate({id_post: req.params.id_post}, {status_bot: false})
                    res.sendStatus(200)
                }
            })    
        })
        .catch(error => {
            console.error(error);
        });
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = {
    comments,
    activeBot,
    disableBot
}