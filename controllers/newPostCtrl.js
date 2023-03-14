const asyncHandler = require('express-async-handler')
const Images = require('../models/Images')
const User = require('../models/User')
const nodemailer = require('nodemailer');
const Posts = require('../models/Posts')
const axios = require('axios')
const Facebook = require('facebook-node-sdk');

// async function notificationEmail(type, email) {
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: true, // true para 465, false para outras portas
//         auth: {
//             user: 'vagner12lemos@gmail.com',
//             pass: 'qrbjshaakihsgkhl'
//         }
//     });

//     let mailOptions = {
//         from: '"PluBee" vagner12lemos@gmail.com',
//         to: 'dev.vagner@gmail.com',
//         subject: 'Publicação enviada com sucesso.',
//         text: 'Conteúdo do email em texto puro',
//         html: '<b>Conteúdo do email em HTML</b>'
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Mensagem enviada: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//     });
// }

async function postNow(pageId, content, imageUrl, accessToken) {
    try {
        const url = `https://graph.facebook.com/${pageId}/feed`;
        const params = {
          message: content,
          access_token: accessToken,
          link: imageUrl
        };
        const response = await axios.post(url, params);
        return {success: true, id_post: response.data.id};
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function programPost(pageId, content, imageUrl, accessToken, day, hour) {
    const fb = new Facebook({ accessToken: accessToken });
    const date = new Date(day + " " + hour);
    const utcDate = new Date(date.toUTCString());
    const scheduledTime = utcDate.toISOString();

    try {
        const response = await new Promise((resolve, reject) => {
            fb.api(
                `/${pageId}/feed`,
                'POST',
                { message: content, scheduled_publish_time: scheduledTime, link: imageUrl },
                function(response) {
                    if (!response || response.error) {
                        reject(response ? response.error : 'Unknown error');
                    } else {
                        resolve(response);
                    }
                }
            );
        });

        return {success: true, id_post: response.data.id};
    } catch (err) {
        return false;
    }
}

async function programPostGroup(group, content, imageUrl, accessToken, day, hour) {
    const fb = new Facebook({ accessToken: accessToken });
    const date = new Date(day + " " + hour);
    const utcDate = new Date(date.toUTCString());
    const scheduledTime = utcDate.toISOString();

    try {
        const response = await new Promise((resolve, reject) => {
            fb.api(
                `/${group}/feed`,
                'POST',
                { message: content, scheduled_publish_time: scheduledTime, link: imageUrl },
                function(response) {
                    if (!response || response.error) {
                        reject(response ? response.error : 'Unknown error');
                    } else {
                        resolve(response);
                    }
                }
            );
        });

        return {success: true, id_post: response.data.id};
    } catch (err) {
        return false;
    }
}

async function postNowGroup(group, content, imageUrl, accessToken) {
    console.log(group)

    try {
        const url = `https://graph.facebook.com/${group}/feed`;
        const params = {
          message: content,
          access_token: accessToken,
          link: imageUrl
        };
        const response = await axios.post(url, params);
        return {success: true, id_post: response.data.id};
    } catch (error) {
        console.log(error);
        return false;
    }
}

// async function makePostIg(id_user, id_post, username, password, images, description) {
//     try {
//         const image = await Images.findById("63eac43d75435a9ce5f39f56")

//         const ig = new IgApiClient();
//         ig.state.generateDevice(username);
        
//         await ig.account.login(username, password);
        
//         const publishResult = await ig.publish.photo({
//             file: "",
//             caption: description,
//         });
        
//         const postId = publishResult.media.pk;
//         console.log(postId)

//         const addPost = await Posts.create({idPost: id_post, idUser: id_user})
//         return 'Sucess'    
//     } catch (err) {
//         console.log(err)
//         return 'Erro'
//     }
// }

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

        const { account, pages, groups, ids_posts, content, program, day, hour, image } = req.body

        const findAccount = await User.findById({_id: req.cookies._id, accountsFb: {$elemMatch: {id_account: account}}})

        const id = await validCode()

        if (findAccount) {
            if (program) {
                // const newPost = await Posts.create({id_post: id, id_user: req.cookies._id, id_account: account, platform: "Facebook", name_account: findAccount.accountsFb[0].name, image_account: findAccount.accountsFb[0].photo, image: image, status_bot: false, day: day, hour: hour, page_id: page, page_name: name, groups: groups, content: content})
                const save = await User.updateOne(
                    { _id: req.cookies._id, "accountsFb.id_account": account },
                    {
                    $push: {
                        "accountsFb.$.posts": {
                            "id_post": id,
                            "id_account": account,
                            "name_account": findAccount.accountsFb[0].name,
                            "image_account": findAccount.accountsFb[0].photo,
                            "status_bot": false,
                            "content": content,
                            "comment_content": "",
                            "day": day,
                            "hour": hour,
                            "platform": "Facebook",
                            "program_post": true,
                            "ids_posts_pages_and_groups": ids_posts,
                            "pages_ids": pages,
                            "groups_ids": groups,
                            "image": image,
                        }
                    }
                    }
                );
                    
                res.sendStatus(200)
            } else {
                // const newPost = await Posts.create({id_post: post.id_post, id_user: req.cookies._id, platform: "Facebook", id_account: account, name_account: findAccount.accountsFb[0].name, image_account: findAccount.accountsFb[0].photo, image: image, status_bot: false, page_id: page, page_name: name, groups: groups, content: content})
                const save = await User.updateOne(
                    { _id: req.cookies._id, "accountsFb.id_account": account },
                    {
                        $push: {
                        "accountsFb.$.posts": {
                            "id_post": id,
                            "id_account": account,
                            "name_account": findAccount.accountsFb[0].name,
                            "image_account": findAccount.accountsFb[0].photo,
                            "status_bot": false,
                            "content": content,
                            "comment_content": "",
                            "platform": "Facebook",
                            "program_post": false,
                            "ids_posts_pages_and_groups": ids_posts,
                            "pages_ids": pages,
                            "groups_ids": groups,
                            "image": image,
                        }
                        }
                    }
                );
                
                res.sendStatus(200)
            }
        } else {
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

    res.render("layouts/postFacebook", { isAdmin: find.isAdmin, accounts: find.accountsFb, groups: find.groups, type_account: find.type_account })
})

const pagesList = asyncHandler(async(req, res) => {
    const findAccount = await User.findOne({_id: req.cookies._id, accountsFb: {$elemMatch: {id_account: req.params.id}}}, {'accountsFb.$': 1})

    console.log(findAccount)
    
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