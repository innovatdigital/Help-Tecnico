const asyncHandler = require('express-async-handler')
const Images = require('../models/Images')
const User = require('../models/User')
const nodemailer = require('nodemailer');
const Posts = require('../models/Posts')
const axios = require('axios')
const Facebook = require('facebook-node-sdk');

async function code() {
    const length = 40;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let idPost = '';

    for (let i = 0; i < length; i++) {
        idPost += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return String(idPost);
}

async function validCode() {
    while (true) {
        const idPost = await code()
        const findCode = await Posts.findOne({idPost: idPost})

        if (findCode) {
            continue
        } else {
            return idPost;
        }
    }
}

const PostFacebook = asyncHandler(async(req, res) => {
    try {
        let name = ''
        
        let name_account = ''
        let image_account = ''

        const { pages, groups, ids_posts, content, program, day, hour, image } = req.body

        let split = ids_posts[0].split("_")

        const findAccount = await User.findById({_id: req.cookies._id})
        findAccount.accountsFb.forEach((account => {
            account.pages.forEach(page => {
                if (page.id_page == split[0]) {
                    name_account = account.name
                    image_account = account.photo
                }
            })
        }))

        const id = await validCode()

        if (findAccount) {
            const split = day.split('-')

            if (program) {
                const newPost = await Posts.create({id_post: id, id_user: req.cookies._id, platform: "Facebook", image: image, status_bot: false, pages_ids: pages, ids_posts_pages_and_groups: ids_posts, program: program, day: day, hour: hour, groups: groups, content: content})
                const save = await User.findByIdAndUpdate(
                    { _id: req.cookies._id },
                    {
                    $push: {
                        posts: {
                            "id_post": id,
                            "status_bot": false,
                            "content": content,
                            "comment_content": "",
                            "day": split[2] + '/' + split[1] + '/' + split[0],
                            "hour": hour,
                            "platform": "Facebook",
                            "program_post": true,
                            "ids_posts_pages_and_groups": ids_posts,
                            "pages_ids": pages,
                            "groups_ids": groups,
                            "name_account": name_account,
                            "image_account": image_account,
                            "image": image
                        }
                    }
                    }
                );
                    
                res.sendStatus(200)
            } else {
                const newPost = await Posts.create({id_post: id, id_user: req.cookies._id, platform: "Facebook", image: image, status_bot: false, pages_ids: pages, ids_posts_pages_and_groups: ids_posts, groups: groups, content: content})
                const save = await User.findByIdAndUpdate(
                    { _id: req.cookies._id },
                    {
                        $push: {
                            posts: {
                                "id_post": id,
                                "status_bot": false,
                                "content": content,
                                "comment_content": "",
                                "platform": "Facebook",
                                "program_post": false,
                                "ids_posts_pages_and_groups": ids_posts,
                                "pages_ids": pages,
                                "groups_ids": groups,
                                "name_account": name_account,
                                "image_account": image_account,
                                "image": image,
                            }
                        }
                    }
                );
                
                res.sendStatus(200)
            }
        } else {
            console.log('aqui')
            res.sendStatus(500)
        }
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

const PostInstagram = asyncHandler(async(req, res) => {
    try {
        const { id_user, id_account } = req.body

        const findAccount = await User.findById({_id: id_user, accountsIg: {$elemMatch: {id_account: id_account}}})
        const targetAccount = findAccount.accountsIg.find(account => account.id_account === id_account);
        
        if (req.body.program_post == "false") {
            if (findAccount) {
                const id_post = await validCode()
                const post = await makePostIg(id_user, id_post, targetAccount.username, targetAccount.password, req.body.images, req.body.description)

                if (post == 'Sucess') {
                    User.findOneAndUpdate({
                        "accountsIg.id_account": id_account
                    }, {
                        $push: {
                            "accountsIg.$.posts": {
                                "id_post": id_post,
                                "description": req.body.description,
                                "program_post": req.body.program_post,
                                "images": req.body.images,
                            }
                        }
                    }, (error, result) => {
                        if (error) {
                            console.error(error);
                            return res.send("Erro");
                        }
                        
                        res.send('Sucesso.')
                    });
                } else {
                    console.log(post)
                    res.send('Erro ao criar post.')
                }

            } else {
                res.send('Nenhuma conta encontrada para fazer a publicação.')
            }
        } else {
            console.log('')
        }
    } catch (err) {
        res.send(err)
    }
})

const postFacebook = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)
    const accountsFb = find.accountsFb
    const groups = []
    
    find.groups.forEach(group => {
      const account = accountsFb.find(account => account.id_account === group.id_account)
      if (account) {
        groups.push({id: group.id, name: group.name, access_token: account.access_token})
      }
    })

    res.render("layouts/postFacebook", { isAdmin: find.isAdmin, accounts: find.accountsFb, groups: groups, pages: find.accountsFb, type_account: find.type_account })
})

const pagesList = asyncHandler(async(req, res) => {
    const findAccount = await User.findOne({_id: req.cookies._id, accountsFb: {$elemMatch: {id_account: req.params.id}}}, {'accountsFb.$': 1})
    
    if (findAccount) {
        res.send(findAccount.accountsFb[0].pages)
    } else {
        res.sendStatus(500)
    }
})

const access_token = asyncHandler(async(req, res) => {
    const findAccount = await User.findById({_id: req.cookies._id, accountsFb: {$elemMatch: {id_account: req.params.id}}}, {'accountsFb.$': 1})
    
    if (findAccount) {
        res.send(findAccount.accountsFb[0].access_token)
    } else {
        res.sendStatus(500)
    }
})

const postInstagram = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render("layouts/postInstagram", { isAdmin: find.isAdmin })
})

module.exports = {
    PostFacebook,
    pagesList,
    access_token,
    postFacebook,
    postInstagram
}