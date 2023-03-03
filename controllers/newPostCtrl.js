const asyncHandler = require('express-async-handler')
const Images = require('../models/Images')
const User = require('../models/User')
const nodemailer = require('nodemailer');
const Posts = require('../models/Posts')
const FB = require('fb')

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

async function makePostFb(id_user, id_account, content) {
    try {
        // Autenticar o usuário
        const accessToken = 'seu_token_de_acesso';

        // Obter o ID do grupo
        const groupId = '1234567890';

        // Configurar o objeto do Facebook SDK
        const fb = new Facebook({
            appId: 'seu_app_id',
            secret: 'seu_app_secret',
            accessToken: accessToken,
        });

        // Publicar na API do grupo
        fb.api(
        `/${groupId}/feed`,
        'POST',
        {
            message: 'Hello, World!',
        },
        (res) => {
            if (!res || res.error) {
            console.error(res.error);
            return;
            }
            console.log(`Mensagem publicada com ID: ${res.id}`);
        }
        );
    } catch (err) {
        return 'Error';
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

async function findIdPage(acess_token, page) {
    try {
        FB.setAccessToken(acess_token);

        FB.api(
          `/${page}?fields=id`,
          function (res) {
            if(!res || res.error) {
              console.log(!res ? 'error occurred' : res.error);
              return;
            }
            return res.id;
          }
        );
    } catch (err) {
        console.log('Ocorreu um erro ao enviar', err)
    }
}

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
        const { account, pages, groups, content, program, day, hour, images } = req.body

        console.log(account, pages, groups, content, program, day, hour, images)

        const findAccount = await User.findById({_id: req.cookies._id, accountsFb: {$elemMatch: {id_account: account}}})

        if (findAccount) {
            const id_post = await validCode()
            const post = await makePostFb(req.cookies._id, id_post, account, content)

            if (post == "Sucess") {
                User.findOneAndUpdate({
                    "accountsFb.id_account": account
                }, {
                    $push: {
                        "accountsFb.$.posts": {
                            "id_post": id_post,
                            "title": req.body.title,
                            "description": req.body.description,
                            "public": req.body.public,
                            "program_post": req.body.program_post,
                            "groups": req.body.groups,
                            "images": req.body.images,
                        }
                    }
                }, (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.send("Erro");
                    }

                    res.sendStatus(200)
                });
            } else {
                res.send('Ocorreu um erro')
            }
        } else {
            res.send(500)
        }
    } catch (err) {
        res.send(err)
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

    const groups = []
    const pages = []

    const groups_format = []
    const pages_format = []

    find.accountsFb.forEach(account => {
        groups.push(account.groups)
        pages.push(account.pages)
    })

    pages.forEach((page) => {
        page.forEach(page_content => {
            pages_format.push({name_page: page_content.name, id: page_content.id_page})
        })
    })

    groups.forEach((group) => {
        group.forEach(group_content => {
            groups_format.push({name_group: group_content.name, id: group_content.id})
        })
    })

    res.render("layouts/postFacebook", { isAdmin: find.isAdmin, accounts: find.accountsFb, groups: groups_format, pages: pages_format })
})

const postInstagram = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render("layouts/postInstagram", { isAdmin: find.isAdmin })
})

module.exports = {
    PostFacebook,
    postFacebook,
    postInstagram
}