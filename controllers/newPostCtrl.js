const asyncHandler = require('express-async-handler')
const Images = require('../models/Images')
const User = require('../models/User')
const nodemailer = require('nodemailer');
const Posts = require('../models/Posts')
const FB = require('fb')
const crypto = require('crypto');
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');


async function notificationEmail(type, email) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true para 465, false para outras portas
        auth: {
            user: 'vagner12lemos@gmail.com',
            pass: 'qrbjshaakihsgkhl'
        }
    });

    let mailOptions = {
        from: '"PluBee" vagner12lemos@gmail.com',
        to: 'dev.vagner@gmail.com',
        subject: 'Publicação enviada com sucesso.',
        text: 'Conteúdo do email em texto puro',
        html: '<b>Conteúdo do email em HTML</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Mensagem enviada: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}

async function makePostFb(id_user, id_post, id_account, title) {
    try {
        const findAccount = await User.findById({_id: id_user, accountsFb: {$elemMatch: {id_account: id_account}}});
        const targetAccount = findAccount.accountsFb.find(account => account.id_account === id_account);

        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        FB.setAccessToken(targetAccount.acess_token); 
        return new Promise((resolve, reject) => {
            FB.api( 
                '/innovatdigital.com.br/feed',
                'POST',
                { "message": "Testing with api" },
                async function (response) {
                    if (response.error) {
                        console.log('Error: ' + response);
                        reject('Error');
                    }
                    const addPost = await Posts.create({id_post: id_post, id_user: id_user, id_account: id_account, name_user: findAccount.name, title: title, date: dataFormat, status_bot: "disabled", platform: "FB", image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpt.vecteezy.com%2Ffotos-gratis%2Fpapel-de-parede&psig=AOvVaw3TOuU8ZGSvpTKUH7q-I3F3&ust=1676489466875000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCKDhnIvglf0CFQAAAAAdAAAAABBj'});
                    resolve('Sucess');
                }
            );
        });
    } catch (err) {
        return 'Error';
    }
}

async function makePostIg(id_user, id_post, username, password, images, description) {
    try {
        const image = await Images.findById("63eac43d75435a9ce5f39f56")

        const ig = new IgApiClient();
        ig.state.generateDevice(username);
        
        await ig.account.login(username, password);
        
        const publishResult = await ig.publish.photo({
            file: "",
            caption: description,
        });
        
        const postId = publishResult.media.pk;
        console.log(postId)

        const addPost = await Posts.create({idPost: id_post, idUser: id_user})
        return 'Sucess'    
    } catch (err) {
        console.log(err)
        return 'Erro'
    }
}

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
        const { id_user, id_account, title } = req.body

        const findAccount = await User.findById({_id: id_user, accountsFb: {$elemMatch: {id_account: id_account}}})

        if (req.body.program_post == "false") {
            if (findAccount) {
                const id_post = await validCode()
                const post = await makePostFb(id_user, id_post, id_account, title)

                if (post == "Sucess") {
                    User.findOneAndUpdate({
                        "accountsFb.id_account": id_account
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

                        res.send('Post publicado.')
                    });
                } else {
                    res.send('Ocorreu um erro')
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
    const find = await User.findById(req.cookies._id).lean()

    res.render("layouts/postFacebook", { isAdmin: find.isAdmin, accounts: find.accountsFb })
})

const postInstagram = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id).lean()

    res.render("layouts/postInstagram", { isAdmin: find.isAdmin })
})

module.exports = {
    postFacebook,
    postInstagram
}