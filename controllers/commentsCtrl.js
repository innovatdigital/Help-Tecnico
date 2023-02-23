const asyncHandler = require('express-async-handler')
const Posts = require('../models/Posts')
const User = require('../models/User')
const Comments = require('../models/Comments')

const comments = asyncHandler(async(req, res) => {
    const find = await User.findOne({email: "admin"})

    if (find.isAdmin == "true") {
        const posts = await Posts.find({})
        const comments = await User.find({}).limit(10)

        res.render('layouts/comments', {isAdmin: true, posts: posts, comments: comments})
    } else {
        const posts = await Posts.find({})
        const comments = await User.find({}).limit(10)

        res.render('layouts/comments', {isAdmin: false, posts: posts, comments: comments})
    }
})


const activeBot = asyncHandler(async(req, res) => {
    try {
        // Salvar o link da publicação nos grupos tmb
        const { id_user, id_post, id_account, content_comment, limit_comments, platform } = req.body

        const newActiveBot = Comments.create({id_user: id_user, id_post: id_post, id_account: parseInt(id_account), content_comment: content_comment, limit_comments: parseInt(limit_comments), platform: platform}, async(error, result) => {
            if (error) {
                console.error(error);
            } else {
                const update = await Posts.findOneAndUpdate({id_post: id_post}, {status_bot: "enable"})

                res.sendStatus(200)
            }
        })

    } catch (err) {
        res.send(err)
    }
})

const disableBot = asyncHandler(async(req, res) => {
    try {
        const id = req.params._id_post

        console.log(req.params)

        const deleteComment = Comments.findOneAndDelete({_id: id}, async(error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log(result)
            }
        })
    } catch (err) {
        res.send(err)
    }
})

module.exports = {
    comments,
    activeBot,
    disableBot
}